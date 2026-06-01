import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { assessInvestmentRisk } from "./_core/riskAssessment";

const shouldAttachRiskContext = (message: string) =>
  /\b(investasi|platform|aplikasi|saham|reksadana|reksa dana|crypto|kripto|forex|trading|emas|ojk|legal|ilegal|bodong|ponzi|return|imbal hasil)\b/i.test(
    message
  );

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  risk: router({
    assess: publicProcedure
      .input(
        z.object({
          query: z.string().min(2),
        })
      )
      .query(async ({ input }) => assessInvestmentRisk(input.query)),
  }),

  chat: router({
    ask: publicProcedure
      .input(
        z.object({
          message: z.string(),
          conversationHistory: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = `Anda adalah asisten keuangan pribadi yang ahli dan berpengalaman. Anda membantu pengguna Indonesia dengan pertanyaan tentang literasi keuangan, investasi, budgeting, pengelolaan utang, dan perencanaan keuangan pribadi.

Pedoman Anda:
1. Berikan jawaban yang jelas, praktis, dan mudah dipahami
2. Hindari jargon keuangan yang terlalu teknis tanpa penjelasan
3. Selalu ingatkan pengguna untuk berkonsultasi dengan financial advisor profesional untuk keputusan investasi besar
4. Waspada terhadap investasi bodong dan selalu sarankan verifikasi di OJK
5. Gunakan contoh nyata dan relevan dengan konteks Indonesia
6. Berikan tips actionable yang bisa langsung diterapkan
7. Selalu menekankan pentingnya dana darurat dan diversifikasi
8. Hindari penggunaan emoji atau simbol dekoratif dalam jawaban

Jawab dalam Bahasa Indonesia yang baik dan profesional.`;

        let riskContext = "";
        if (shouldAttachRiskContext(input.message)) {
          try {
            const riskAssessment = await assessInvestmentRisk(input.message);
            riskContext = `

Konteks tambahan dari pengecekan risiko investasi:
- Sumber: ${riskAssessment.dataSource} (${riskAssessment.sourceStatus})
- Level: ${riskAssessment.level}
- Skor: ${riskAssessment.score}/100
- Alasan: ${riskAssessment.reason}
- Kecocokan data: ${
            riskAssessment.matches.length > 0
              ? riskAssessment.matches
                  .slice(0, 3)
                  .map((match) => `${match.source}: ${match.name}`)
                  .join("; ")
              : "Tidak ada kecocokan langsung"
          }
Gunakan konteks ini hanya jika relevan dengan pertanyaan pengguna. Jangan mengarang status legalitas di luar data tersebut.`;
          } catch {
            riskContext = "";
          }
        }

        const messages = [
          { role: "system" as const, content: `${systemPrompt}${riskContext}` },
          ...(input.conversationHistory || []),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages: messages as any,
        });

        const content = response.choices[0]?.message?.content;
        const reply = typeof content === 'string' 
          ? content 
          : "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";

        return {
          reply,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
