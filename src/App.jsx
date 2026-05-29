import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import KnowledgeList from './pages/KnowledgeList/KnowledgeList';
import KnowledgeDetail from './pages/KnowledgeDetail/KnowledgeDetail';
import TimelinePage from './pages/TimelinePage/TimelinePage';
import QuizHome from './pages/QuizHome/QuizHome';
import QuizSession from './pages/QuizSession/QuizSession';
import QuizResult from './pages/QuizResult/QuizResult';
import Progress from './pages/Progress/Progress';

function App() {
  return (
    <BrowserRouter basename="/history-learning">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/knowledge" element={<KnowledgeList />} />
          <Route path="/knowledge/:lessonId" element={<KnowledgeDetail />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/quiz" element={<QuizHome />} />
          <Route path="/quiz/session" element={<QuizSession />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
