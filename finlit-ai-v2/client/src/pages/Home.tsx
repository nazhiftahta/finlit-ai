import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  BookOpen,
  Wallet,
  MessageCircle,
  ArrowRight,
  Shield,
  Target,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Penilaian Risiko',
      description: 'Temukan profil risiko investasi Anda dan dapatkan rekomendasi alokasi yang sesuai',
      action: () => navigate('/risk-checker'),
      cta: 'Mulai Penilaian',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Wawasan Keuangan',
      description: 'Pelajari literasi keuangan melalui artikel dan tips yang disesuaikan dengan kebutuhan Anda',
      action: () => navigate('/educational-insights'),
      cta: 'Jelajahi Artikel',
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Panduan Keuangan',
      description: 'Kelola anggaran, bangun dana darurat, dan rencanakan investasi dengan strategi yang terbukti',
      action: () => navigate('/money-guide'),
      cta: 'Buka Panduan',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Asisten Keuangan',
      description: 'Tanya jawab dengan AI tentang keuangan pribadi, investasi, dan pengelolaan uang',
      action: () => navigate('/chatbot'),
      cta: 'Mulai Chat',
    },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Aman & Terpercaya',
      description: 'Informasi akurat dari sumber terpercaya untuk melindungi investasi Anda',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Personal & Relevan',
      description: 'Rekomendasi disesuaikan dengan profil risiko dan tujuan finansial Anda',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Cepat & Mudah',
      description: 'Interface yang intuitif dan responsif untuk akses kapan saja, di mana saja',
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-primary/10 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex mb-4 h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            <img
              src="/logo.png"
              alt="Finlit AI"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Kelola Keuangan Anda dengan Cerdas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            FinLit adalah platform komprehensif untuk meningkatkan literasi keuangan, mengelola risiko
            investasi, dan merencanakan masa depan finansial yang lebih cerah.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/risk-checker')}
            className="gap-2"
          >
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="p-6 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group"
              onClick={feature.action}
            >
              <div className="flex flex-col h-full">
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">{feature.description}</p>
                <Button
                  variant="outline"
                  className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                >
                  {feature.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Mengapa Pilih FinLit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="text-center">
              <div className="inline-block p-3 rounded-full bg-secondary/20 text-secondary mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container px-4 py-12">
        <Card className="p-8 md:p-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Siap Mengambil Langkah Pertama?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Mulai dengan penilaian risiko investasi Anda dan dapatkan rekomendasi personal yang
              disesuaikan dengan profil finansial Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/risk-checker')}>
                Penilaian Risiko
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/money-guide')}
              >
                Panduan Keuangan
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="container px-4 py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>
          FinLit membantu Anda membuat keputusan finansial yang lebih baik dengan informasi yang
          akurat dan rekomendasi yang personal.
        </p>
      </div>
    </div>
  );
}
