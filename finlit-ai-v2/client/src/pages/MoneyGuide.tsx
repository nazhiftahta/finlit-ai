import { useState } from 'react';
import { AlertCircle, Plus, Trash2, Wallet, TrendingUp, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
}

type Step = {
  title: string;
  description: string;
  tips: string[];
};

const steps: Step[] = [
  {
    title: 'Pencatatan Keuangan',
    description:
      'Langkah awal adalah memetakan arus kas dengan mencatat seluruh pendapatan dan pengeluaran secara rinci. Mengetahui ke mana arah uang Anda pergi setiap bulan adalah kunci untuk mengidentifikasi pos pengeluaran yang tidak perlu.',
    tips: [
      'Catat pemasukan dan pengeluaran setiap hari atau setiap minggu',
      'Gunakan kategori agar pola terlihat jelas',
      'Review mingguan untuk menemukan kebocoran kecil',
    ],
  },
  {
    title: 'Penyusunan Anggaran',
    description:
      'Alokasikan pendapatan berdasarkan prioritas dengan metode yang sesuai dengan kondisi Anda. Salah satu pedoman populer adalah metode 50/30/20: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan atau investasi.',
    tips: [
      'Mulai dari 50/30/20 sebagai acuan awal',
      'Tetapkan transfer otomatis untuk tabungan dan investasi',
      'Sesuaikan anggaran saat pendapatan atau biaya berubah',
    ],
  },
  {
    title: 'Pembangunan Dana Darurat',
    description:
      'Sisihkan dana di awal penerimaan untuk membentuk jaring pengaman finansial. Dana darurat membantu menanggung pengeluaran mendadak tanpa mengganggu pos keuangan lain.',
    tips: [
      'Target 3-6 bulan pengeluaran',
      'Simpan di tempat yang mudah dicairkan',
      'Isi kembali jika pernah terpakai',
    ],
  },
  {
    title: 'Pengelolaan Utang',
    description:
      'Jaga batas cicilan utang, idealnya maksimal sekitar sepertiga dari total pendapatan, dan selalu bayar tepat waktu agar arus kas tetap sehat.',
    tips: [
      'Prioritaskan utang berbunga tinggi',
      'Bayar tepat waktu untuk menghindari biaya tambahan',
      'Jangan tambah utang konsumtif tanpa rencana',
    ],
  },
  {
    title: 'Investasi dan Pengembangan Aset',
    description:
      'Setelah dana darurat dan anggaran lebih stabil, alokasikan sisa dana untuk instrumen investasi yang sesuai dengan profil risiko dan target jangka panjang Anda.',
    tips: [
      'Diversifikasi untuk mengurangi risiko',
      'Investasi jangka panjang cenderung lebih optimal',
      'Pastikan memahami biaya dan risikonya',
    ],
  },
];

const expenseCategories = [
  'Makanan',
  'Transportasi',
  'Tempat Tinggal',
  'Utilitas',
  'Hiburan',
  'Belanja',
  'Kesehatan',
  'Pendidikan',
  'Lainnya',
];

export default function MoneyGuide() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [newExpenseCategory, setNewExpenseCategory] = useState('Makanan');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);

  const addExpense = () => {
    if (newExpenseAmount > 0) {
      setExpenses([
        ...expenses,
        {
          id: Date.now().toString(),
          category: newExpenseCategory,
          amount: newExpenseAmount,
        },
      ]);
      setNewExpenseAmount(0);
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const surplus = income - totalExpenses;

  const allocatedSavings = income * 0.2;
  const allocatedNeeds = income * 0.5;
  const allocatedWants = income * 0.3;

  const recommendations = () => {
    const recs: string[] = [];
    if (income <= 0) {
      return ['Masukkan pendapatan bulanan agar panduan kalkulasi bisa lebih relevan.'];
    }

    if (totalExpenses > income && totalExpenses > 0) {
      recs.push(
        `Perhatian: pengeluaran melebihi pendapatan sebesar Rp ${Math.abs(surplus).toLocaleString('id-ID', { maximumFractionDigits: 0 })}. Mulai kurangi pengeluaran yang tidak prioritas.`
      );
    } else if (surplus >= 0) {
      recs.push(
        `Anda punya surplus Rp ${surplus.toLocaleString('id-ID', { maximumFractionDigits: 0 })}. Pertimbangkan alokasi untuk dana darurat dan investasi.`
      );
    }

    if (totalExpenses > income * 0.8) {
      recs.push(
        'Perhatian: pengeluaran mendekati atau di atas 80% pendapatan. Fokus optimasi di kategori keinginan agar tabungan 20% lebih mudah tercapai.'
      );
    }

    return recs;
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Smart Money Guide</h1>
        <p className="text-muted-foreground mb-8">
          Berikut adalah tahapan pengelolaan uang yang efektif untuk menjaga kesehatan finansial Anda.
        </p>

        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps">Panduan Langkah</TabsTrigger>
            <TabsTrigger value="calculator">Kalkulator</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-4 mt-6">
            {steps.map((step, idx) => (
              <Card key={step.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                      <span className="text-primary font-bold text-lg">{idx + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex gap-2 text-sm">
                          <span className="text-primary font-bold">-</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground">
                Gunakan langkah-langkah di atas sebagai rutinitas. Konsistensi kecil setiap minggu sering lebih berdampak daripada perubahan besar sesekali.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6 mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Kalkulator Anggaran dan Pengeluaran</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="income" className="text-base font-medium">
                    Pendapatan Bulanan (Rp)
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Masukkan pendapatan bulanan Anda"
                    value={income || ''}
                    onChange={(event) => setIncome(parseFloat(event.target.value) || 0)}
                    className="mt-2"
                  />
                </div>

                {income > 0 && (
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold">Tambah Pengeluaran</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="category" className="text-sm">
                          Kategori
                        </Label>
                        <select
                          id="category"
                          value={newExpenseCategory}
                          onChange={(event) => setNewExpenseCategory(event.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        >
                          {expenseCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="amount" className="text-sm">
                          Jumlah (Rp)
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0"
                          value={newExpenseAmount || ''}
                          onChange={(event) => setNewExpenseAmount(parseFloat(event.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={addExpense}
                          disabled={newExpenseAmount <= 0}
                          className="w-full gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah
                        </Button>
                      </div>
                    </div>

                    {expenses.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium text-sm">Pengeluaran Anda</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {expenses.map((expense) => (
                            <div
                              key={expense.id}
                              className="flex justify-between items-center p-2 bg-background rounded border border-border"
                            >
                              <div>
                                <span className="font-medium text-sm">{expense.category}</span>
                                <span className="text-muted-foreground text-sm ml-2">
                                  Rp {expense.amount.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <button
                                onClick={() => removeExpense(expense.id)}
                                className="text-destructive hover:bg-destructive/10 p-1 rounded"
                                aria-label={`Hapus pengeluaran ${expense.category}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {income > 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-900 dark:text-green-100">
                            Kebutuhan (50%)
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                          Rp {allocatedNeeds.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <PieChart className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900 dark:text-blue-100">
                            Keinginan (30%)
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          Rp {allocatedWants.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground">
                            Tabungan dan Investasi (20%)
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          Rp {allocatedSavings.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </p>
                      </div>

                      {expenses.length > 0 && (
                        <div
                          className={`p-4 rounded-lg border ${
                            surplus >= 0
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className={`w-5 h-5 ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                            <span className="font-semibold">
                              {surplus >= 0 ? 'Surplus' : 'Defisit'}
                            </span>
                          </div>
                          <p className={`text-2xl font-bold ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Rp {Math.abs(surplus).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Rekomendasi untuk Anda</h3>
                      {recommendations().map((recommendation) => (
                        <div
                          key={recommendation}
                          className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-100">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
