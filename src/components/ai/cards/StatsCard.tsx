import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
}) => {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-foreground">
            {value}
          </span>
          {trend && (
            <span className={trend.isPositive ? "text-xs text-green-600" : "text-xs text-red-600"}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
