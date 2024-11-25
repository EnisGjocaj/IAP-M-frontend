import React, { useState, useEffect } from 'react';
import TeamGrid from '../components/common/TeamGrid.tsx';
import { getAllTeamMembers } from '../api/teamMembers';
import { toast } from 'react-toastify';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getAllTeamMembers();
        console.log(response.data);
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

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Board Members
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">
            Meet the exceptional individuals who guide our institution towards excellence and innovation.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No team members found.</p>
          </div>
        ) : (
          <TeamGrid members={teamMembers} />
        )}
      </div>
    </section>
  );
};

export default TeamSection;
