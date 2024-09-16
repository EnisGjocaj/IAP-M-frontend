// // src/pages/CreateTeamMemberForm.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createTeamMember } from '../../api/teamMembers'; // Update import path as needed
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CreateTeamMemberForm = () => {
//     const [formValues, setFormValues] = useState({
//       fullName: '',
//       role: '',
//       description: '',
//       title: '',
//       imgSrc: '',
//     });
//     const [imageFile, setImageFile] = useState(null);
//     const navigate = useNavigate();
  
//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [name]: value,
//       }));
//     };
  
//     const handleImageUpload = (e) => {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         imgSrc: URL.createObjectURL(file),
//       }));
//     };
  
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('fullName', formValues.fullName);
//         formData.append('role', formValues.role);
//         formData.append('description', formValues.description);
//         formData.append('title', formValues.title);
//         if (imageFile) {
//           formData.append('image', imageFile); // Ensure this matches the field name expected by your backend
//         }
    
//         try {
//           await createTeamMember(formData); // Use updated API function
    
//           toast.success('Team member created successfully!', {
//             position: "top-center",
//             autoClose: 5000,
//             closeButton: true,
//             icon: '✅',
//           });
//           navigate('/admin/dashboard-team-members');
//         } catch (error) {
//           toast.error('Failed to submit application. Please try again.', {
//             position: "top-center",
//             autoClose: 5000,
//             closeButton: true,
//           });
//         }
//       };
    
  
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Create Team Member</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formValues.fullName}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
//             <input
//               type="text"
//               id="role"
//               name="role"
//               value={formValues.role}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formValues.title}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formValues.description}
//               onChange={handleChange}
//               required
//               rows="4"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
//             <input
//               type="file"
//               id="image"
//               name="image"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="mt-1 block w-full text-sm"
//             />
//             {formValues.imgSrc && (
//               <img
//                 src={formValues.imgSrc}
//                 alt="Preview"
//                 className="mt-2 w-12 object-cover"
//               />
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
//           >
//             Create Team Member
//           </button>
//         </form>
//       </div>
//     );
//   };
// export default CreateTeamMemberForm;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeamMember , getTeamMemberById, updateTeamMember} from '../../api/teamMembers'; // Adjust import path
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useParams } from 'react-router-dom';

const CreateTeamMemberForm = () => {
    const [formValues, setFormValues] = useState({
      fullName: '',
      role: '',
      description: '',
      title: '',
      imgSrc: '', // For previewing the image
    });
    const [imageFile, setImageFile] = useState(null); // Store the selected image file
    const [loading, setLoading] = useState(true); // To manage loading state
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL
  
    useEffect(() => {
        if (id) { // Checks if we are in edit mode
          const fetchTeamMember = async () => {
            try {
              const response = await getTeamMemberById(id);
              console.log("responseee", response.data)
              const member = response.data;
              setFormValues({
                fullName: member.fullName || '',
                role: member.role || '',
                description: member.description || '',
                title: member.title || '',
                imgSrc: member.imgSrc || '', // Set existing image URL
              });
              setLoading(false);
            } catch (error) {
              console.error('Error fetching team member:', error);
              toast.error('Failed to fetch team member details. Please try again.');
            }
          };
      
          fetchTeamMember();
        } else {
          setLoading(false); // No ID, so no need to load existing data
        }
      }, [id]);
      
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      setImageFile(file); // Set the selected image file
      setFormValues((prevValues) => ({
        ...prevValues,
        imgSrc: URL.createObjectURL(file), // Set the preview image URL
      }));
    };
  
    const handleRemoveImage = () => {
      setImageFile(null); // Clear the image file
      setFormValues((prevValues) => ({
        ...prevValues,
        imgSrc: '', // Clear the preview image URL
      }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append('fullName', formValues.fullName);
        formData.append('role', formValues.role);
        formData.append('description', formValues.description);
        formData.append('title', formValues.title);
      
        if (imageFile) {
          formData.append('image', imageFile); // Append the image file
        }
      
        try {
          if (id) {
            // Update the existing team member
            await updateTeamMember(id, formData);
            toast.success('Team member updated successfully!', {
              position: "top-center",
              autoClose: 5000,
              closeButton: true,
              icon: '✅',
            });
          } else {
            // Create a new team member
            await createTeamMember(formData);
            toast.success('Team member created successfully!', {
              position: "top-center",
              autoClose: 5000,
              closeButton: true,
              icon: '✅',
            });
          }
          navigate('/admin/dashboard-team-members'); // Navigate to the team members dashboard after success
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('Failed to save team member. Please try again.', {
            position: "top-center",
            autoClose: 5000,
            closeButton: true,
          });
        }
      };
      
  
    if (loading) {
      return <div>Loading...</div>; // You can replace this with a proper loading spinner
    }
  
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Team Member' : 'Create Team Member'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
  
          {/* Role Field */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formValues.role}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
  
          {/* Title Field */}
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
  
          {/* Description Field */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
  
          {/* Image Upload Field */}
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
            {/* Preview the uploaded image */}
            {formValues.imgSrc && (
              <div className="relative mt-2 w-48 h-48">
                <img
                  src={formValues.imgSrc}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
                {/* X button to remove the image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            {id ? 'Update Team Member' : 'Create Team Member'}
          </button>
        </form>
      </div>
    );
  };

export default CreateTeamMemberForm;

