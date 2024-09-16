// src/pages/News.js
import React, { useEffect, useState } from 'react';
import { getAllNews, deleteNews } from '../../api/news';
import { useNavigate } from 'react-router-dom';

import CustomTable from '../../components/common/CustomTable';

const DashboardNews = () => {
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await getAllNews();
      setNewsList(response.data.message || []); // Accessing the actual data from API response
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await deleteNews(id);
        fetchNews(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-news/${id}`);
  };

  const headers = ['ID', 'Title'];

  const tableData = newsList.map((news) => ({
    id: news.id,
    title: news.title,
  }));

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">News</h1>
        <button
          onClick={() => navigate('/admin/create-news')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Article
        </button>
      </div>
      <CustomTable headers={headers} data={tableData} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};


export default DashboardNews;