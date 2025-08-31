import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import toast from 'react-hot-toast';
import { generateLessonContent, searchYoutubeVideo } from '../utils/api.js';
import Markdown from 'markdown-to-jsx';
import DownloadButton from '../components/DownloadButton.jsx';

// --- Content Block Components ---

const HeadingBlock = ({ text }) => (
  <h2 className="text-3xl font-bold mt-6 mb-4">
    <Markdown options={{ overrides: { code: { component: 'code', props: { className: 'bg-gray-200 text-red-600 font-mono px-1.5 py-1 rounded-md' } } } }}>
      {text}
    </Markdown>
  </h2>
);

const ParagraphBlock = ({ text }) => (
  <div className="mb-4 text-gray-700 leading-relaxed">
    <Markdown options={{ overrides: { code: { component: 'code', props: { className: 'bg-gray-200 text-red-600 font-mono px-1.5 py-1 rounded-md' } } } }}>
      {text}
    </Markdown>
  </div>
);

const CodeBlock = ({ text }) => (
  <pre className="bg-gray-800 text-white p-4 my-4 rounded-md overflow-x-auto">
    <code>{text}</code>
  </pre>
);

// This is the complete VideoBlock component

const VideoBlock = ({ query, onVideoFetched }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await searchYoutubeVideo(query, token);
        const fetchedVideoId = response.data.videoId;
        
        // Set the state to display the video
        setVideoId(fetchedVideoId);
        
        // Pass the fetched ID back up to the parent component
        if (onVideoFetched) {
          onVideoFetched(fetchedVideoId);
        }
      } catch (error) {
        console.error('Failed to fetch video for query:', query, error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [query, getAccessTokenSilently, onVideoFetched]);

  if (loading) {
    return <div className="p-4 my-6 bg-gray-200 rounded-md animate-pulse h-64"></div>;
  }
  
  if (!videoId) {
    return <div className="p-4 my-6 bg-red-100 text-red-700 rounded-md">Could not find a video for "{query}".</div>;
  }

  return (
    <div className="my-6">
      <iframe
        className="w-full aspect-video rounded-lg shadow-md"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const MCQBlock = ({ question, options, answer, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === answer;

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
  };

  return (
    <div className="my-6 p-6 border rounded-lg bg-gray-50">
      <div className="font-semibold text-lg mb-4">
        <Markdown>{question}</Markdown>
      </div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(index);
              setShowResult(false);
            }}
            className={`block w-full text-left p-3 rounded-md border-2 transition-colors ${
              selected === index ? 'bg-blue-100 border-blue-400' : 'bg-white hover:bg-gray-50'
            }`}
            disabled={showResult}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={handleCheck} disabled={selected === null} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
        Check Answer
      </button>
      
      {showResult && (
        <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <Markdown options={{ overrides: { code: { component: 'code', props: { className: `font-mono px-1.5 py-1 rounded-md ${isCorrect ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}` } } } }}>
            {isCorrect ? `Correct! ${explanation}` : `Incorrect. The correct answer is: **${options[answer]}**. ${explanation}`}
          </Markdown>
        </div>
      )}
    </div>
  );
};

// --- Main Lesson Page Component ---
const LessonPage = () => {
  const { lessonId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLinks, setVideoLinks] = useState({});

  const handleVideoFetched = (query, videoId) => {
  setVideoLinks(prevLinks => ({ ...prevLinks, [query]: videoId }));
};

  useEffect(() => {
    const fetchLessonContent = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await generateLessonContent(lessonId, token);
        setLesson(response.data);
      } catch (error) {
        toast.error('Failed to load lesson content.');
      } finally {
        setLoading(false);
      }
    };
    fetchLessonContent();
  }, [lessonId, getAccessTokenSilently]);

  if (loading) return <div className="text-center p-8">Loading lesson...</div>;
  if (!lesson) return <div className="text-center p-8">Lesson not found.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{lesson.title}</h1>
        <DownloadButton rootElementId="lessonContent" downloadFileName={lesson.title} videoLinks={videoLinks}/>
      </div>
      
      <div id="lessonContent">
        {lesson.content.map((block, index) => {
          switch (block.type) {
            case 'heading':
              return <HeadingBlock key={index} text={block.text} />;
            case 'paragraph':
              return <ParagraphBlock key={index} text={block.text} />;
            case 'code':
              return <CodeBlock key={index} text={block.text} />;
            case 'video':
              return <VideoBlock key={index} query={block.query} onVideoFetched={(videoId) => handleVideoFetched(block.query, videoId)} />;
            case 'mcq':
              return <MCQBlock key={index} {...block} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default LessonPage;