import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BookOpen, Lightbulb, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  category: 'budgeting' | 'investasi' | 'keamanan' | 'tabungan';
  excerpt: string;
  icon: React.ReactNode;
  content: string;
  readTime: number;
};

const articles: Article[] = [
  {
    id: 'budget-50-30-20',
    title: 'Membuat Anggaran Bulanan dengan Metode 50/30/20',
    category: 'budgeting',
    excerpt:
      'Cara sederhana membagi pendapatan agar kebutuhan terpenuhi, keinginan tetap terkendali, dan tabungan berjalan konsisten.',
    icon: <Wallet className="w-6 h-6" />,
    readTime: 5,
    content: `Metode 50/30/20 membantu Anda membagi pendapatan menjadi tiga bagian utama: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan atau investasi.

Langkah praktis:
1. Hitung pendapatan bersih bulanan.
2. Pisahkan kebutuhan wajib seperti makan, transportasi, tempat tinggal, listrik, dan cicilan produktif.
3. Batasi pos keinginan seperti hiburan, langganan, dan belanja impulsif.
4. Transfer tabungan di awal bulan sebelum uang dipakai untuk pengeluaran lain.
5. Evaluasi setiap akhir minggu agar kebocoran kecil cepat terlihat.

Tips:
- Jika pengeluaran kebutuhan lebih dari 50%, mulai dari target yang realistis, misalnya 60/25/15.
- Gunakan satu rekening khusus untuk dana darurat agar tidak tercampur dengan uang belanja.
- Revisi anggaran ketika pendapatan atau biaya hidup berubah.`,
  },
  {
    id: 'dana-darurat',
    title: 'Dana Darurat: Fondasi Sebelum Mulai Investasi',
    category: 'tabungan',
    excerpt:
      'Panduan menentukan target dana darurat, tempat menyimpan, dan cara membangunnya secara bertahap.',
    icon: <BookOpen className="w-6 h-6" />,
    readTime: 6,
    content: `Dana darurat adalah cadangan uang yang dipakai untuk kondisi mendesak, seperti kehilangan pekerjaan, biaya kesehatan, atau perbaikan penting.

Target umum:
1. Lajang tanpa tanggungan: 3 sampai 6 bulan pengeluaran.
2. Sudah berkeluarga: 6 sampai 12 bulan pengeluaran.
3. Pekerja lepas atau pendapatan tidak tetap: utamakan target yang lebih tinggi.

Tempat menyimpan:
- Rekening tabungan terpisah yang mudah dicairkan.
- Deposito pendek yang tidak mengunci seluruh dana.
- Reksadana pasar uang untuk sebagian dana jika Anda memahami risikonya.

Tips:
- Mulai dari target pertama Rp 1.000.000 agar lebih mudah konsisten.
- Sisihkan otomatis saat gajian.
- Gunakan hanya untuk kebutuhan mendesak, bukan promo atau belanja rutin.`,
  },
  {
    id: 'investasi-pemula',
    title: 'Investasi untuk Pemula: Mulai dari Produk yang Dipahami',
    category: 'investasi',
    excerpt:
      'Urutan berpikir sebelum memilih instrumen investasi agar keputusan lebih rasional dan sesuai tujuan.',
    icon: <TrendingUp className="w-6 h-6" />,
    readTime: 7,
    content: `Investasi sebaiknya dimulai setelah arus kas sehat dan dana darurat mulai terbentuk. Tujuannya bukan mengejar keuntungan cepat, tetapi membangun aset secara bertahap.

Sebelum memilih produk, jawab empat pertanyaan ini:
1. Apa tujuan investasinya?
2. Kapan uang itu akan digunakan?
3. Berapa kerugian sementara yang masih bisa Anda terima?
4. Apakah produk tersebut terdaftar dan diawasi lembaga resmi?

Contoh pendekatan:
- Tujuan kurang dari 1 tahun: instrumen likuid dan rendah risiko.
- Tujuan 1 sampai 3 tahun: hindari produk yang terlalu volatil.
- Tujuan di atas 5 tahun: saham atau reksadana saham bisa dipelajari bertahap sesuai profil risiko.

Tips:
- Jangan membeli produk hanya karena sedang ramai dibicarakan.
- Pahami biaya, risiko, dan cara mencairkan dana.
- Diversifikasi agar risiko tidak terkumpul di satu produk.`,
  },
  {
    id: 'hindari-investasi-bodong',
    title: 'Mengenali Tanda Investasi Bodong',
    category: 'keamanan',
    excerpt:
      'Ciri umum penipuan investasi dan langkah pengecekan sebelum menyerahkan uang.',
    icon: <ShieldCheck className="w-6 h-6" />,
    readTime: 6,
    content: `Investasi bodong sering menggunakan tekanan emosional: takut ketinggalan, janji untung cepat, atau testimoni berlebihan.

Tanda yang perlu diwaspadai:
1. Menjanjikan keuntungan pasti atau sangat tinggi.
2. Mengaku tanpa risiko.
3. Meminta keputusan cepat.
4. Tidak menjelaskan sumber keuntungan dengan jelas.
5. Legalitas sulit diverifikasi.
6. Lebih menekankan perekrutan anggota daripada kinerja produk.

Langkah perlindungan:
- Cek legalitas melalui kanal resmi OJK atau lembaga terkait.
- Minta dokumen produk dan pahami isi perjanjiannya.
- Hindari transfer ke rekening pribadi yang tidak sesuai nama lembaga.
- Diskusikan dengan pihak yang netral sebelum mengambil keputusan.

Prinsip penting: investasi yang sehat tidak perlu memaksa Anda mengambil keputusan terburu-buru.`,
  },
  {
    id: 'utang-sehat',
    title: 'Mengelola Utang agar Tidak Mengganggu Arus Kas',
    category: 'budgeting',
    excerpt:
      'Cara menilai batas cicilan, menyusun prioritas pelunasan, dan menghindari utang konsumtif berulang.',
    icon: <AlertCircle className="w-6 h-6" />,
    readTime: 5,
    content: `Utang tidak selalu buruk, tetapi perlu dikendalikan. Utang produktif bisa membantu jika digunakan untuk aset atau peningkatan pendapatan. Utang konsumtif berulang biasanya lebih berisiko.

Panduan dasar:
1. Jaga total cicilan maksimal sekitar 30% dari pendapatan bulanan.
2. Prioritaskan pelunasan utang berbunga tinggi.
3. Hindari membayar cicilan dengan utang baru.
4. Catat tanggal jatuh tempo agar tidak terkena denda.
5. Evaluasi langganan atau pengeluaran yang membuat Anda terus berutang.

Tips:
- Gunakan metode snowball jika butuh motivasi dari utang kecil yang cepat lunas.
- Gunakan metode avalanche jika ingin menghemat bunga paling besar.
- Tunda belanja besar sampai arus kas kembali stabil.`,
  },
  {
    id: 'kebiasaan-mingguan',
    title: 'Rutinitas Keuangan Mingguan yang Mudah Dipertahankan',
    category: 'tabungan',
    excerpt:
      'Checklist singkat untuk menjaga anggaran, tabungan, dan keputusan belanja tetap terkendali.',
    icon: <Lightbulb className="w-6 h-6" />,
    readTime: 4,
    content: `Literasi keuangan menjadi lebih berguna jika berubah menjadi kebiasaan kecil yang rutin dilakukan.

Rutinitas mingguan:
1. Cek saldo rekening dan e-wallet.
2. Kelompokkan pengeluaran ke kebutuhan, keinginan, dan tabungan.
3. Tandai tiga pengeluaran yang bisa dikurangi minggu depan.
4. Pastikan tagihan mendatang sudah disiapkan dananya.
5. Catat satu keputusan finansial yang berhasil Anda lakukan.

Tips:
- Jadwalkan 15 menit di hari yang sama setiap minggu.
- Jangan menunggu data sempurna. Mulai dari catatan sederhana.
- Fokus memperbaiki satu kebiasaan dulu, misalnya mengurangi belanja impulsif.`,
  },
];

const categories = [
  { value: 'semua', label: 'Semua' },
  { value: 'budgeting', label: 'Budget' },
  { value: 'investasi', label: 'Investasi' },
  { value: 'keamanan', label: 'Keamanan' },
  { value: 'tabungan', label: 'Tabungan' },
] as const;

export default function EducationalInsights() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState('semua');

  const filteredArticles =
    activeCategory === 'semua'
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  if (selectedArticle) {
    return (
      <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 py-8">
          <Button
            variant="outline"
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            Kembali
          </Button>

          <article className="max-w-3xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-primary mt-1">{selectedArticle.icon}</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {selectedArticle.title}
                </h1>
                <p className="text-muted-foreground">
                  Waktu baca: {selectedArticle.readTime} menit
                </p>
              </div>
            </div>

            <Card className="p-6 mt-6 whitespace-pre-wrap text-foreground leading-relaxed">
              {selectedArticle.content}
            </Card>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Wawasan Keuangan</h1>
        <p className="text-muted-foreground mb-8">
          Pelajari literasi keuangan melalui artikel dan tips yang disesuaikan dengan kebutuhan Anda.
        </p>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="p-5 hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex gap-4">
                  <div className="text-primary flex-shrink-0 mt-1">{article.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {article.readTime} menit baca
                      </span>
                      <span className="text-sm text-primary font-medium">
                        Baca selengkapnya
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
