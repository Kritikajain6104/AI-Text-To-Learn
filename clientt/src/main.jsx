import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import CreateCoursePage from './pages/CreateCoursePage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import { Auth0Provider } from '@auth0/auth0-react'; 

ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://api.text-to-learn.com' // Add your API Audience here
      }}
    >
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreateCoursePage />} />
          <Route path="course/:courseId" element={<CoursePage />} />
          <Route path="course/:courseId/lesson/:lessonId" element={<LessonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Auth0Provider>
);