import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth0 } from '@auth0/auth0-react'; // 1. Import the useAuth0 hook

const PromptForm = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0(); // 2. Get the function to fetch the token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Generating your course...');

    try {
      // 3. Get the token before making the API call
      const token = await getAccessTokenSilently();

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/courses/generate`,
        { topic: topic },
        {
          // 4. Use the real token in the request header
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success('Course generated successfully!', { id: toastId });
      navigate(`/course/${response.data._id}`);

    } catch (err) {
      console.error('Error generating course:', err);
      toast.error(err.response?.data?.message || 'Failed to generate course.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create a New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="topic-input" className="block mb-2 font-medium text-gray-900">
              What do you want to learn today?
            </label>
            <input
              type="text"
              id="topic-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="e.g., 'Introduction to React Hooks'"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3 text-center"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;