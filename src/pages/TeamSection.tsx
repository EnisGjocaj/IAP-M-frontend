import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TeamCategory from '../components/common/TeamCategory.tsx';
import { Briefcase, Users, Award } from 'lucide-react';
import { getAllTeamMembers } from '../api/teamMembers';

interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  title: string;
  description: string;
  imagePath: string;
  cvPath?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getAllTeamMembers();
        if (response.data) {
          setTeamMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const directors = teamMembers.filter(member => member.role === 'EXECUTIVE_DIRECTOR');
  const coordinators = teamMembers.filter(member => member.role === 'MEETING_COORDINATOR');
  const boardMembers = teamMembers.filter(member => member.role === 'BOARD_MEMBER');
  const presidents = teamMembers.filter(member => member.role === 'PRESIDENT');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="max-w-[95%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      
        {presidents.length > 0 && (
          <TeamCategory
            title="President"
            subtitle="Leading our organization"
            icon={<Award className="w-8 h-8 text-blue-600" />}
            members={presidents}
            highlight={true}
          />
        )}

      
        {directors.length > 0 && (
          <TeamCategory
            title="Board of Directors"
            subtitle="Leading with vision and purpose"
            icon={<Briefcase className="w-8 h-8 text-blue-600" />}
            members={directors}
            highlight={true}
          />
        )}

        {coordinators.length > 0 && (
          <TeamCategory
            title="Program Coordinators"
            subtitle="Orchestrating success across departments"
            icon={<Award className="w-8 h-8 text-blue-600" />}
            members={coordinators}
          />
        )}

        {boardMembers.length > 0 && (
          <TeamCategory
            title="Board Members"
            subtitle="Shaping our future through collective expertise"
            icon={<Users className="w-8 h-8 text-blue-600" />}
            members={boardMembers}
          />
        )}

        {teamMembers.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No team members found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
