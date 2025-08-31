import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// We will add interceptors here later to automatically add the auth token

export const getCourseById = (courseId, token) => {
  return api.get(`/api/courses/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ... (getCourseById function)

export const generateLessonContent = (lessonId, token) => {
  return api.post(
    `/api/lessons/${lessonId}/generate`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ... (other functions)
export const searchYoutubeVideo = (query, token) => {
  return api.get(`/api/youtube/search?query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ... (other api functions)
export const getMyCourses = (token) => {
  return api.get("/api/courses/my-courses", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
