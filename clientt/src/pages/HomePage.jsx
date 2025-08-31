import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { getMyCourses } from '../utils/api.js';
import toast from 'react-hot-toast';

const CallToAction = () => (
  <div className="mt-8 text-center bg-gray-50 p-10 rounded-lg border-2 border-dashed border-gray-300">
    <h2 className="text-2xl font-semibold text-gray-700">Your learning space is empty!</h2>
    <p className="mt-2 text-gray-500">Generate your first course and kickstart your learning adventure.</p>
    <Link to="/create">
      <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
        Create Your First Course
      </button>
    </Link>
  </div>
);

const CourseGrid = ({ courses }) => (
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map(course => (
      <Link to={`/course/${course._id}`} key={course._id} className="block bg-white border rounded-lg shadow-sm p-5 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-800 truncate">{course.title}</h3>
        <p className="mt-2 text-gray-600 text-sm h-16 overflow-hidden">{course.description}</p>
        <span className="mt-4 inline-block text-blue-600 font-semibold">
          Go to course &rarr;
        </span>
      </Link>
    ))}
  </div>
);

const HomePage = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      // Only fetch if the user is authenticated and the user object is available
      if (isAuthenticated && user) {
        setLoading(true);
        try {
          const token = await getAccessTokenSilently();
          const response = await getMyCourses(token);
          setCourses(response.data);
        } catch (error) {
          toast.error("Could not fetch your courses.");
        } finally {
          setLoading(false);
        }
      } else {
        // If the user is not authenticated, we're not loading anything
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isAuthenticated, user, getAccessTokenSilently]); // Add 'user' to the dependency array

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800">Welcome back, {user?.name || 'learner'}!</h1>
        <p className="mt-2 text-gray-600">Your personal learning dashboard.</p>
      </div>
      
      {isAuthenticated && (courses.length === 0 ? <CallToAction /> : <CourseGrid courses={courses} />)}
    </div>
  );
};

export default HomePage;