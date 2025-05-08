
import { Globe, TrendingUp, Rocket } from "lucide-react";
import { BenefitCard } from "./BenefitCard";

interface BenefitsListProps {
  language?: "pt" | "en";
}

export function BenefitsList({ language = "pt" }: BenefitsListProps) {
  const benefits = {
    pt: [
      {
        icon: Rocket,
        title: "Insights exclusivos sobre a revolução Web3"
      },
      {
        icon: TrendingUp,
        title: "Estratégias de tokenização para transformar ativos reais em valor digital"
      },
      {
        icon: Globe,
        title: "Acesso ao mercado global de inovação e negócios descentralizados"
      }
    ],
    en: [
      {
        icon: Rocket,
        title: "Exclusive insights on the Web3 revolution"
      },
      {
        icon: TrendingUp,
        title: "Tokenization strategies to transform real assets into digital value"
      },
      {
        icon: Globe,
        title: "Access to the global market of innovation and decentralized business"
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {benefits[language].map((benefit, index) => (
        <BenefitCard key={index} {...benefit} />
      ))}
    </div>
  );
}
