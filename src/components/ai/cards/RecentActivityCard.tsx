import React from "react";
import { LucideIcon, Clock } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  time: string;
  type: "query" | "material" | "exam" | "advisor";
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

const typeStyles = {
  query: "bg-secondary/10 text-secondary",
  material: "bg-success/10 text-success",
  exam: "bg-primary/10 text-primary",
  advisor: "bg-info/10 text-info",
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
}) => {
  return (
    <div className="ai-card border border-border p-5">
      <h3 className="font-semibold text-lg text-foreground mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              typeStyles[activity.type]
            )}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">
                {activity.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {activity.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;
