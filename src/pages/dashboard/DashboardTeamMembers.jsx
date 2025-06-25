
import React, { useEffect, useState } from 'react';
import { getAllTeamMembers, deleteTeamMember } from '../../api/teamMembers';
import { useNavigate } from 'react-router-dom';
import CustomTable from '../../components/common/CustomTable';

const DashboardTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await getAllTeamMembers();
      console.log(response.data);
      setTeamMembers(response.data || []); 
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(id);
        fetchTeamMembers(); 
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-team-member/${id}`);
  };

  const headers = ['ID', 'Name', 'Role', "Title", 'Description'];

  const truncateDescription = (description) => {
    if (!description) return '';
    return description.length > 100 ? `${description.substring(0, 100)}...` : description;
  };

  const tableData = teamMembers.map((member) => ({
    id: member.id,
    name: member.fullName,
    role: member.role,
    title: member.title,
    description: truncateDescription(member.description),
  }));

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          onClick={() => navigate('/admin/create-team-member')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Team Member
        </button>
      </div>
      <CustomTable headers={headers} data={tableData} onDelete={handleDelete} onEdit={handleEdit}  />
    </div>
  );
};

export default DashboardTeamMembers;
