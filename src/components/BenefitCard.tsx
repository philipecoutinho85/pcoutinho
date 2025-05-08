
import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
}

export function BenefitCard({ icon: Icon, title }: BenefitCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300 animate-fade-in touch-element">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Icon className="w-8 h-8 text-neon-yellow transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
        <p className="text-white/80 text-lg leading-relaxed">{title}</p>
      </div>
    </div>
  );
}
