# Text-to-Learn: AI-Powered Course Generator

![Project Demo GIF](link_to_your_demo_gif_here) An AI-powered, full-stack web application that transforms any user-submitted topic into a structured, multi-module online course.

**Live Demo:** [https://your-vercel-app-url.vercel.app](https://your-vercel-app-url.vercel.app)

---

## Features

- **AI Course Generation:** Enter any topic and receive a complete course outline with modules and lessons, powered by the Google Gemini API.
- **Rich Lesson Content:** Lessons include formatted text, code snippets, relevant YouTube video suggestions, and interactive multiple-choice quizzes.
- **User Authentication:** Secure login and registration handled by Auth0, allowing users to save and manage their own courses.
- **"My Courses" Dashboard:** A personalized dashboard that lists all courses created by the logged-in user.
- **On-Demand Content Loading:** Detailed lesson content is "lazy-loaded" via API calls to ensure a fast initial user experience.
- **PDF Downloads:** Download any lesson as a styled PDF for offline learning, complete with clickable links for referenced videos.
- **Responsive Design:** A mobile-first, responsive UI built with Tailwind CSS that works on all screen sizes.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Axios, Auth0 React SDK
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **APIs & Services:** Google Gemini API, YouTube Data API, Auth0
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Setup & Installation

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd text-to-learn
    ```
2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    # Create a .env file and add your variables (MONGO_URI, GEMINI_API_KEY, etc.)
    npm run dev
    ```
3.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    # Create a .env file and add your variables (VITE_API_URL, VITE_AUTH0_DOMAIN, etc.)
    npm run dev
    ```
