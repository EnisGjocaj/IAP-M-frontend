import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNews, getNewsById, updateNews } from '../../api/news';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useParams } from 'react-router-dom';

const CreateNewsForm = () => {
  const { id } = useParams(); // Get the news ID from the URL
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const isEditMode = !!id; // Check if we're in edit mode
  const navigate = useNavigate();

  // Fetch news data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchNewsData(id);
    }
  }, [isEditMode, id]);

  const fetchNewsData = async (newsId) => {
    try {
      const response = await getNewsById(newsId);
      const newsData = response.data.message;
      setFormValues({
        title: newsData.title,
        content: newsData.content,
        imageUrl: newsData.imageUrl,
      });
    } catch (error) {
      toast.error('Failed to fetch news data.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormValues((prevValues) => ({
        ...prevValues,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      imageUrl: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('content', formValues.content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (isEditMode) {
        // Call updateNews if editing
        await updateNews(id, formData);
        toast.success('News article updated successfully.', {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      } else {
        // Call createNews if creating
        await createNews(formData);
        toast.success('News article created successfully.', {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      }
      navigate('/admin/dashboard-news');
    } catch (error) {
      toast.error('Failed to submit. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit News' : 'Create News'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            name="content"
            value={formValues.content}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm"
          />
          {formValues.imageUrl && (
            <div className="relative mt-2">
              <img
                src={formValues.imageUrl}
                alt="Preview"
                className="w-full h-auto object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 text-white bg-red-600 hover:bg-red-700 rounded-full p-1 focus:outline-none"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Update News' : 'Create News'}
        </button>
      </form>
    </div>
  );
};

export default CreateNewsForm;
