import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../api/manageUsers'; 
import { useNavigate } from 'react-router-dom';
import CustomTable from '../../components/common/CustomTable';

const DashboardUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log(response.data);
      setUsersList(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-user/${id}`);
  };
  

  const headers = ['ID', 'Name', 'Email'];

  const tableData = usersList.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={() => navigate('/admin/create-user')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New User
        </button>
      </div>
      <CustomTable headers={headers} data={tableData} onDelete={handleDelete} onEdit={handleEdit}/>
    </div>
  );
};

export default DashboardUsers;
