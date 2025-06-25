import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNews, getNewsById, updateNews } from '../../api/news';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaNewspaper, FaImage } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const CreateNewsForm = () => {
  const { id } = useParams(); 
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const isEditMode = !!id; 
  const navigate = useNavigate();


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
        
        await updateNews(id, formData);
        toast.success('News article updated successfully.', {
          position: "top-center",
          autoClose: 5000,
          closeButton: true,
        });
      } else {
        
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
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit News Article' : 'Create News Article'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaNewspaper className="w-4 h-4 text-blue-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">News Details</h3>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter news title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                id="content"
                name="content"
                value={formValues.content}
                onChange={handleChange}
                required
                rows={6}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter news content"
              />
            </div>
          </div>

        

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FaImage className="w-4 h-4 text-purple-600" />
              </span>
              <h3 className="text-lg font-semibold text-gray-800">Featured Image</h3>
            </div>

            <div className="mt-2">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <label className="relative cursor-pointer w-full">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {formValues.imageUrl ? (
                      <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={formValues.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FaImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {formValues.imageUrl ? 'Change Image' : 'Choose Image'}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              {formValues.imageUrl && (
                <div className="mt-3 flex items-center justify-between p-3 bg-purple-50 rounded-md">
                  <div className="flex items-center gap-2">
                    <FaImage className="text-purple-500" />
                    <span className="text-sm text-purple-700 font-medium">Image Selected</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            {isEditMode ? 'Update News Article' : 'Create News Article'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewsForm;
