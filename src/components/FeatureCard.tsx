
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex justify-center">{icon}</div>
        <h3 className="text-neon-yellow text-xl font-semibold">{title}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
