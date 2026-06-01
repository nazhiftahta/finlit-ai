import { ENV } from "./env";

export type RiskLevel = "Aman" | "Peringatan" | "Bahaya";

export type RiskMatch = {
  source: "OJK Illegal" | "OJK Aplikasi Legal" | "OJK Produk Legal";
  name: string;
  owner?: string;
  detail?: string;
  url?: string;
};

export type RiskAssessment = {
  query: string;
  level: RiskLevel;
  score: number;
  reason: string;
  why: string;
  matches: RiskMatch[];
  dataSource: string;
  sourceStatus: "live" | "fallback";
  checkedAt: string;
};

type OjkRecord = Record<string, unknown>;

type OjkCache = {
  expiresAt: number;
  illegals: OjkRecord[];
  apps: OjkRecord[];
  products: OjkRecord[];
};

let cache: OjkCache | null = null;

const CACHE_TTL_MS = 1000 * 60 * 30;
const OJK_SOURCE = "OJK Invest API";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s.']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueTokens(value: string) {
  return Array.from(new Set(normalize(value).split(" ").filter((token) => token.length > 2)));
}

function recordText(record: OjkRecord) {
  return normalize(
    Object.values(record)
      .filter((value) => typeof value === "string" || typeof value === "number")
      .join(" ")
  );
}

function getName(record: OjkRecord) {
  return String(record.name || record.title || record.company || record.entity || "Data OJK");
}

function getDetail(record: OjkRecord) {
  return String(record.type || record.category || record.management || record.description || "");
}

function getOwner(record: OjkRecord) {
  return String(record.owner || record.management || record.developer || "");
}

function getUrl(record: OjkRecord) {
  const value = record.url || record.website || record.link;
  return typeof value === "string" ? value : undefined;
}

function extractArray(payload: unknown, key: string): OjkRecord[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(root)) return root as OjkRecord[];
  if (Array.isArray(root[key])) return root[key] as OjkRecord[];

  if (data && typeof data === "object") {
    const dataObject = data as Record<string, unknown>;
    if (Array.isArray(dataObject[key])) return dataObject[key] as OjkRecord[];
  }

  return [];
}

async function fetchJson(path: string, signal: AbortSignal) {
  const baseUrl = ENV.ojkInvestApiUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`OJK API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchWithTimeout<T>(task: (signal: AbortSignal) => Promise<T>, timeoutMs = 4500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await task(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

async function getOjkData() {
  if (cache && cache.expiresAt > Date.now()) {
    return cache;
  }

  const [illegalsResult, appsResult, productsResult] = await Promise.allSettled([
    fetchWithTimeout((signal) => fetchJson("/api/illegals", signal)),
    fetchWithTimeout((signal) => fetchJson("/api/apps", signal)),
    fetchWithTimeout((signal) => fetchJson("/api/products", signal)),
  ]);

  if (
    illegalsResult.status === "rejected" &&
    appsResult.status === "rejected" &&
    productsResult.status === "rejected"
  ) {
    throw illegalsResult.reason;
  }

  cache = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    illegals:
      illegalsResult.status === "fulfilled" ? extractArray(illegalsResult.value, "illegals") : [],
    apps: appsResult.status === "fulfilled" ? extractArray(appsResult.value, "apps") : [],
    products:
      productsResult.status === "fulfilled" ? extractArray(productsResult.value, "products") : [],
  };

  return cache;
}

function findMatches(records: OjkRecord[], query: string, source: RiskMatch["source"]) {
  const normalizedQuery = normalize(query);
  const tokens = uniqueTokens(query);

  if (!normalizedQuery || tokens.length === 0) return [];

  return records
    .map((record) => {
      const text = recordText(record);
      const directMatch = text.includes(normalizedQuery);
      const tokenHits = tokens.filter((token) => text.includes(token)).length;
      const relevance = directMatch ? tokens.length + 2 : tokenHits;

      return { record, relevance };
    })
    .filter(({ relevance }) => relevance >= Math.min(2, tokens.length))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
    .map(({ record }) => ({
      source,
      name: getName(record),
      owner: getOwner(record) || undefined,
      detail: getDetail(record) || undefined,
      url: getUrl(record),
    }));
}

function heuristicScore(query: string) {
  const normalizedQuery = normalize(query);

  const dangerKeywords = [
    "bodong",
    "ponzi",
    "money game",
    "skema cepat kaya",
    "robot",
    "martingale",
    "tanpa risiko",
    "pasti untung",
    "profit harian",
    "return tinggi",
  ];
  const warningKeywords = [
    "crypto",
    "kripto",
    "forex",
    "binary",
    "options",
    "leverage",
    "margin",
    "saham",
    "reksadana saham",
    "high yield",
  ];

  if (dangerKeywords.some((keyword) => normalizedQuery.includes(keyword))) {
    return {
      level: "Bahaya" as RiskLevel,
      score: 88,
      reason:
        "Kata kunci yang dimasukkan mengandung ciri penawaran berisiko tinggi, seperti janji pasti untung, imbal hasil tidak wajar, atau skema cepat kaya.",
    };
  }

  if (warningKeywords.some((keyword) => normalizedQuery.includes(keyword))) {
    return {
      level: "Peringatan" as RiskLevel,
      score: normalizedQuery.includes("leverage") || normalizedQuery.includes("margin") ? 70 : 58,
      reason:
        "Produk atau istilah yang dimasukkan biasanya memiliki volatilitas, kompleksitas, atau risiko pasar yang perlu dipahami sebelum mengambil keputusan.",
    };
  }

  return {
    level: "Peringatan" as RiskLevel,
    score: 45,
    reason:
      "Belum ada indikator bahaya yang kuat, tetapi legalitas dan risiko produk tetap perlu diverifikasi melalui sumber resmi sebelum berinvestasi.",
  };
}

function scoreLegalProduct(match: RiskMatch) {
  const detail = normalize(`${match.name} ${match.detail ?? ""}`);

  if (detail.includes("money market")) return 28;
  if (detail.includes("fixed income")) return 42;
  if (detail.includes("mixed asset")) return 55;
  if (detail.includes("equity")) return 68;
  if (detail.includes("capital protected") || detail.includes("terproteksi")) return 38;
  return 35;
}

function buildWhy(query: string, level: RiskLevel, matches: RiskMatch[], sourceStatus: "live" | "fallback") {
  const name = query.trim() || "produk/platform ini";
  const sourceNote =
    sourceStatus === "live"
      ? "Penilaian juga mempertimbangkan data OJK Invest API."
      : "Penilaian memakai heuristik lokal karena data OJK belum dapat diakses saat ini.";

  if (level === "Bahaya") {
    return `${name} perlu dihindari sampai legalitasnya jelas. Jika sebuah penawaran masuk daftar ilegal atau memiliki ciri imbal hasil tidak wajar, risiko kehilangan dana jauh lebih besar daripada potensi keuntungannya. ${sourceNote}`;
  }

  if (level === "Peringatan") {
    return `${name} perlu dicek lebih lanjut. Pastikan entitas, aplikasi, atau produknya sesuai dengan dokumen resmi, pahami biaya dan risiko, serta jangan menaruh dana darurat pada instrumen yang volatil. ${sourceNote}`;
  }

  const legalMatch = matches[0]?.name ? `Ditemukan kecocokan dengan ${matches[0].name}. ` : "";
  return `${legalMatch}${name} terlihat lebih terkendali dari sisi legalitas, tetapi tetap bukan berarti bebas risiko. Sesuaikan dengan tujuan, horizon waktu, dan profil risiko pribadi. ${sourceNote}`;
}

export async function assessInvestmentRisk(query: string): Promise<RiskAssessment> {
  const checkedAt = new Date().toISOString();

  try {
    const data = await getOjkData();
    const illegalMatches = findMatches(data.illegals, query, "OJK Illegal");
    const appMatches = findMatches(data.apps, query, "OJK Aplikasi Legal");
    const productMatches = findMatches(data.products, query, "OJK Produk Legal");
    const matches = [...illegalMatches, ...appMatches, ...productMatches].slice(0, 8);

    const hasLegalMatches = appMatches.length > 0 || productMatches.length > 0;
    const hasCloneWarning = illegalMatches.some((match) =>
      normalize(`${match.name} ${match.detail ?? ""}`).includes("menduplikasi")
    );

    if (illegalMatches.length > 0 && hasLegalMatches && hasCloneWarning) {
      const matches = [...illegalMatches, ...appMatches, ...productMatches].slice(0, 8);

      return {
        query,
        level: "Peringatan",
        score: 74,
        reason:
          "Ditemukan entri ilegal yang menduplikasi nama atau kanal serupa, tetapi juga ada kecocokan dengan data legal. Pastikan Anda hanya memakai aplikasi, situs, dan rekening resmi.",
        why: buildWhy(query, "Peringatan", matches, "live"),
        matches,
        dataSource: OJK_SOURCE,
        sourceStatus: "live",
        checkedAt,
      };
    }

    if (illegalMatches.length > 0) {
      const result = {
        level: "Bahaya" as RiskLevel,
        score: 96,
        reason:
          "Ditemukan kecocokan dengan daftar investasi ilegal atau berisiko dari data OJK. Jangan menambah dana sebelum legalitasnya benar-benar jelas.",
      };

      return {
        query,
        ...result,
        why: buildWhy(query, result.level, matches, "live"),
        matches,
        dataSource: OJK_SOURCE,
        sourceStatus: "live",
        checkedAt,
      };
    }

    if (productMatches.length > 0) {
      const score = Math.max(...productMatches.map(scoreLegalProduct));
      const level: RiskLevel = score >= 60 ? "Peringatan" : "Aman";

      return {
        query,
        level,
        score,
        reason:
          level === "Aman"
            ? "Ditemukan kecocokan dengan produk atau pengelola yang terdata. Risiko tetap perlu dilihat dari jenis produk, biaya, dan tujuan investasi."
            : "Ditemukan kecocokan dengan produk legal, tetapi jenis produknya tetap memiliki risiko pasar yang perlu dipahami.",
        why: buildWhy(query, level, matches, "live"),
        matches,
        dataSource: OJK_SOURCE,
        sourceStatus: "live",
        checkedAt,
      };
    }

    if (appMatches.length > 0) {
      return {
        query,
        level: "Aman",
        score: 32,
        reason:
          "Ditemukan kecocokan dengan aplikasi atau kanal investasi yang terdata. Tetap pastikan alamat situs/aplikasi benar dan transaksi dilakukan melalui kanal resmi.",
        why: buildWhy(query, "Aman", matches, "live"),
        matches,
        dataSource: OJK_SOURCE,
        sourceStatus: "live",
        checkedAt,
      };
    }

    const heuristic = heuristicScore(query);

    return {
      query,
      ...heuristic,
      why: buildWhy(query, heuristic.level, matches, "live"),
      matches,
      dataSource: OJK_SOURCE,
      sourceStatus: "live",
      checkedAt,
    };
  } catch {
    const heuristic = heuristicScore(query);

    return {
      query,
      ...heuristic,
      why: buildWhy(query, heuristic.level, [], "fallback"),
      matches: [],
      dataSource: "Heuristik lokal",
      sourceStatus: "fallback",
      checkedAt,
    };
  }
}
