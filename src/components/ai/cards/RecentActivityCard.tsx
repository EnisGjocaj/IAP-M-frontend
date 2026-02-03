import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}

interface RecentActivityCardProps {
  activities: Activity[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div key={activity.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
