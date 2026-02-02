import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "accent";
}

const variantStyles = {
  default: {
    card: "bg-card border-border",
    icon: "bg-muted text-muted-foreground",
    value: "text-foreground",
  },
  primary: {
    card: "bg-primary/5 border-primary/20",
    icon: "bg-primary text-primary-foreground",
    value: "text-foreground",
  },
  secondary: {
    card: "bg-secondary/5 border-secondary/20",
    icon: "bg-secondary text-secondary-foreground",
    value: "text-foreground",
  },
  accent: {
    card: "bg-accent border-accent/50",
    icon: "bg-secondary text-secondary-foreground",
    value: "text-foreground",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "ai-card p-5 border transition-all duration-300 hover:shadow-card-hover",
      styles.card
    )}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-bold", styles.value)}>
              {value}
            </span>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </span>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          styles.icon
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
