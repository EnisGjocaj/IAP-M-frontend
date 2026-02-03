import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  href,
}) => {
  return (
    <Link
      to={href}
      className="group block p-4 bg-card border border-border rounded-lg hover:border-secondary/50 hover:shadow-md transition-all"
    >
      <h3 className="font-medium text-foreground group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>
      <span className="inline-flex items-center text-sm text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Go <ArrowRight className="w-3 h-3 ml-1" />
      </span>
    </Link>
  );
};

export default QuickActionCard;
