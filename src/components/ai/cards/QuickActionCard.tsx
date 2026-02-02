import React from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "primary" | "secondary";
}

const variantStyles = {
  default: {
    card: "bg-card border-border hover:border-secondary/50",
    icon: "bg-muted text-muted-foreground group-hover:bg-secondary group-hover:text-secondary-foreground",
    title: "text-foreground",
    arrow: "text-muted-foreground group-hover:text-secondary",
  },
  primary: {
    card: "bg-gradient-to-br from-primary to-primary/80 border-primary/50 hover:shadow-ai-glow",
    icon: "bg-primary-foreground/20 text-primary-foreground",
    title: "text-primary-foreground",
    arrow: "text-primary-foreground/70 group-hover:text-primary-foreground",
  },
  secondary: {
    card: "bg-gradient-to-br from-secondary to-secondary/90 border-secondary/50 hover:shadow-lg",
    icon: "bg-secondary-foreground/20 text-secondary-foreground",
    title: "text-secondary-foreground",
    arrow: "text-secondary-foreground/70 group-hover:text-secondary-foreground",
  },
};

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}) => {
  const styles = variantStyles[variant];

  return (
    <Link
      to={href}
      className={cn(
        "group block ai-card p-5 border transition-all duration-300",
        styles.card
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
          styles.icon
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={cn("font-semibold text-lg", styles.title)}>
              {title}
            </h3>
            <ArrowRight className={cn(
              "w-5 h-5 transition-all duration-300 group-hover:translate-x-1",
              styles.arrow
            )} />
          </div>
          <p className={cn(
            "text-sm mt-1",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default QuickActionCard;
