import React from 'react';
import TeamMemberCard from './TeamMemberCard.tsx';
import { LucideChartNoAxesGantt } from 'lucide-react';
import { cn } from '../../utils/cn.ts';

interface TeamCategoryProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  members: any[];
  highlight?: boolean;
}

const TeamCategory: React.FC<TeamCategoryProps> = ({
  title,
  subtitle,
  icon,
  members,
  highlight = false,
}) => {
  return (
    <div className={cn(
      "rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-300",
      highlight ? "bg-white shadow-lg" : "bg-transparent"
    )}>
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <div className="w-20 sm:w-24 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6"></div>
        <p className="text-base sm:text-lg text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            {...member}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCategory;