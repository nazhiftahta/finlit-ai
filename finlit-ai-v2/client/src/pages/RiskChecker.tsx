import { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, RefreshCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';

type RiskLevel = 'Aman' | 'Peringatan' | 'Bahaya';

function getRiskIcon(level?: RiskLevel) {
  if (level === 'Aman') return <CheckCircle className="w-16 h-16 text-green-500" />;
  if (level === 'Peringatan') return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
  if (level === 'Bahaya') return <AlertCircle className="w-16 h-16 text-orange-500" />;
  return <Search className="w-16 h-16 text-muted-foreground" />;
}

function formatCheckedAt(value?: string) {
  if (!value) return '';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function RiskChecker() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const assessmentQuery = trpc.risk.assess.useQuery(
    { query: submittedQuery },
    {
      enabled: submittedQuery.trim().length >= 2,
      retry: false,
    }
  );

  const assessment = assessmentQuery.data;
  const level = assessment?.level;
  const canSubmit = query.trim().length >= 2 && !assessmentQuery.isFetching;

  const handleSubmit = () => {
    const nextQuery = query.trim();
    if (nextQuery.length < 2) return;
    setSubmittedQuery(nextQuery);
  };

  const handleReset = () => {
    setQuery('');
    setSubmittedQuery('');
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Investment Risk Checker
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              Masukkan nama investasi atau platform untuk mengecek skor risiko dengan bantuan data OJK dan analisis lokal.
            </p>

            <Card className="p-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="investment" className="text-base font-medium">
                    Nama Investasi / Platform
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="investment"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSubmit();
                        }
                      }}
                      placeholder="Contoh: Bibit, Pluang, Reksadana Saham, atau Skema Investasi Bodong"
                      className="flex-1"
                    />
                    <Button onClick={handleSubmit} disabled={!canSubmit} className="gap-2">
                      <Search className="w-4 h-4" />
                      Cek
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getRiskIcon(level)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h2 className="text-xl font-semibold">
                          {assessmentQuery.isFetching
                            ? 'Memeriksa risiko'
                            : level
                              ? `Skor Risiko: ${level}`
                              : 'Skor Risiko'}
                        </h2>
                        {assessment && (
                          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">
                            Risiko {assessment.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {assessmentQuery.isFetching
                          ? 'Mengambil data legalitas dan produk investasi. Mohon tunggu sebentar.'
                          : assessment?.reason ||
                            'Ketik nama investasi atau platform, lalu jalankan pengecekan risikonya.'}
                      </p>
                      {assessmentQuery.error && (
                        <p className="text-sm text-destructive mt-2">
                          Pengecekan belum berhasil. Silakan coba lagi beberapa saat lagi.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {assessment && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mengapa Ini Penting</h3>
                      <p className="text-muted-foreground leading-relaxed">{assessment.why}</p>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <h3 className="font-semibold">Sumber Pengecekan</h3>
                        <span className="text-xs text-muted-foreground">
                          {assessment.dataSource} · {assessment.sourceStatus === 'live' ? 'data langsung' : 'fallback lokal'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Diperiksa pada {formatCheckedAt(assessment.checkedAt)}
                      </p>

                      {assessment.matches.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {assessment.matches.map((match) => (
                            <div
                              key={`${match.source}-${match.name}`}
                              className="rounded-md bg-background border border-border p-3"
                            >
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className="font-medium">{match.name}</p>
                                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                  {match.source}
                                </span>
                              </div>
                              {match.owner && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Pemilik/Pengelola: {match.owner}
                                </p>
                              )}
                              {match.detail && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Detail: {match.detail}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Tidak ada kecocokan langsung pada data yang tersedia. Gunakan hasil ini sebagai sinyal awal, bukan keputusan akhir.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Uji Ulang
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
