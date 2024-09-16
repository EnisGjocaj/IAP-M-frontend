// TeamMemberProfile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamMemberById } from '../api/teamMembers';
import ProfileDetails from '../components/common/ProfileDetails';

const TeamMemberProfile = () => {
    const { id } = useParams(); // Get the team member ID from the URL
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamMember = async () => {
            try {
                setLoading(true);
                const response = await getTeamMemberById(id);
                setMemberData(response.data); // Assuming the API response is in response.data
            } catch (error) {
                setError('Failed to fetch team member data');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMember();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!memberData) return <div>No team member data found</div>;

    return (
        <ProfileDetails
            coverImage={memberData.coverImage}
            avatarImage={`http://localhost:4000${memberData.imagePath}`}
            name={memberData.fullName}
            role={memberData.role}
            location={memberData.location}
            skills={memberData.skills || []}
        />
    );
};

export default TeamMemberProfile;
