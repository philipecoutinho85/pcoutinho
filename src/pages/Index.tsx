
import { EmailForm } from "@/components/EmailForm";
import { Footer } from "@/components/Footer";
import { BenefitsList } from "@/components/BenefitsList";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  const texts = {
    pt: {
      title: "Philipe Coutinho - Consultoria Especializada em Web3, Blockchain, Tokenização e Smart Contracts",
      metaDescription: "Insights exclusivos sobre Web3, Tokenização e Blockchain com Philipe Coutinho. Aprenda estratégias de tokenização e acesse o mercado global de negócios descentralizados.",
      future: "O Futuro pertence a quem está pronto.",
      comingSoon: "Estamos finalizando um novo espaço dedicado à transformação digital. Aguarde: grandes novidades estão chegando.",
      profile: "Referência em Web3, Tokenização e Blockchain, revela os bastidores, tendências e oportunidades.",
      subscribe: "Inscreva-se agora e receba, em primeira mão:",
      privacy: "🔒 Zero Spam. Só Conteúdo de Valor.",
      cta: "Seja protagonista da próxima grande transformação econômica."
    },
    en: {
      title: "Philipe Coutinho - Specialized Consulting in Web3, Blockchain, Tokenization and Smart Contracts",
      metaDescription: "Exclusive insights on Web3, Tokenization, and Blockchain with Philipe Coutinho. Learn tokenization strategies and access the global decentralized business market.",
      future: "The Future belongs to those who are ready.",
      comingSoon: "We are finalizing a new space dedicated to digital transformation. Stay tuned: big news coming soon.",
      profile: "Reference in Web3, Tokenization, and Blockchain, reveals the behind-the-scenes, trends, and opportunities.",
      subscribe: "Subscribe now and receive first-hand:",
      privacy: "🔒 Zero Spam. Only Valuable Content.",
      cta: "Be a protagonist of the next great economic transformation."
    }
  };

  return (
    <div className="min-h-screen bg-black font-['Poppins']">
      <Helmet>
        <title>{texts[language].title}</title>
        <meta name="description" content={texts[language].metaDescription} />
        <meta name="keywords" content="Web3, Tokenização, Blockchain, Philipe Coutinho, economia digital, ativos digitais, negócios descentralizados" />
        <meta name="author" content="Philipe Coutinho" />
        <link rel="canonical" href="https://philipecoutinho.com/" />
        <meta property="og:title" content={texts[language].title} />
        <meta property="og:description" content={texts[language].metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://philipecoutinho.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={texts[language].title} />
        <meta name="twitter:description" content={texts[language].metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>
      
      {/* Header */}
      <header className="w-full py-12 animate-fade-in">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <img 
            src="/lovable-uploads/e1726b5f-1e11-4dc7-8581-6cffdeebe4c5.png" 
            alt="Philipe Coutinho" 
            className="h-16"
          />
          
          {/* Language Selector */}
          <ToggleGroup 
            type="single" 
            value={language} 
            onValueChange={(value) => value && setLanguage(value as "pt" | "en")}
            className="bg-neon-purple/30 rounded-md border border-neon-purple/50"
          >
            <ToggleGroupItem value="pt" aria-label="Português">
              PT
            </ToggleGroupItem>
            <ToggleGroupItem value="en" aria-label="English">
              EN
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-16">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-neon-yellow text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center">
                {texts[language].future}
              </h2>
              
              {/* Coming Soon Message */}
              <div className="bg-neon-purple/90 p-6 rounded-lg">
                <p className="text-white text-lg md:text-xl leading-relaxed">
                  {texts[language].comingSoon}
                </p>
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-32 h-32">
                  <img 
                    src="/lovable-uploads/4d46d8f2-b240-41be-942d-76d801b8bdc4.png"
                    alt="Philipe Coutinho" 
                    className="w-full h-full rounded-full object-cover border-4 border-neon-purple animate-fade-in"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-xl font-semibold">Philipe Coutinho</h3>
                  <p className="text-white text-lg md:text-xl leading-relaxed">
                    {texts[language].profile}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="space-y-8">
              <p className="text-neon-yellow text-xl font-medium">
                {texts[language].subscribe}
              </p>
              <BenefitsList language={language} />
            </div>

            {/* Form Section */}
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-neon-yellow text-xl font-medium">
                {texts[language].privacy}
              </p>
              <p className="text-white text-lg">
                {texts[language].cta}
              </p>
              <EmailForm language={language} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Toast container for success notifications */}
      <Toaster />
    </div>
  );
}

export default Index;
