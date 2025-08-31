import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourseById } from '../utils/api.js';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const CoursePage = () => {
  const { courseId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await getCourseById(courseId, token);
        setCourse(response.data);
      } catch (error) {
        toast.error('Failed to load the course details.');
        console.error('Fetch course error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, getAccessTokenSilently]);

  if (loading) {
    return <div className="text-center p-8">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center p-8">Course not found.</div>;
  }

  // This is the part to check carefully
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-8">{course.description}</p>
      
      <div className="space-y-6">
        {course.modules && course.modules.map((module, index) => (
          <div key={module._id} className="p-6 border rounded-lg shadow-sm bg-white">
            <h2 className="text-2xl font-semibold text-gray-800">
              Module {index + 1}: {module.title}
            </h2>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              {module.lessons && module.lessons.map(lesson => (
                <li key={lesson._id}><Link
                  to={`/course/${courseId}/lesson/${lesson._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {lesson.title}
                </Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;