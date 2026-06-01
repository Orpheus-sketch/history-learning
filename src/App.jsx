import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SubjectSelect from './pages/SubjectSelect/SubjectSelect';
import Welcome from './pages/Welcome/Welcome';
import AccountSelect from './pages/AccountSelect/AccountSelect';
import AccountCreate from './pages/AccountCreate/AccountCreate';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';
import Home from './pages/Home/Home';
import KnowledgeList from './pages/KnowledgeList/KnowledgeList';
import KnowledgeDetail from './pages/KnowledgeDetail/KnowledgeDetail';
import TimelinePage from './pages/TimelinePage/TimelinePage';
import MapAtlas from './pages/MapAtlas/MapAtlas';
import BioAtlas from './pages/BioAtlas/BioAtlas';
import QuizHome from './pages/QuizHome/QuizHome';
import QuizSession from './pages/QuizSession/QuizSession';
import QuizResult from './pages/QuizResult/QuizResult';
import Progress from './pages/Progress/Progress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubjectSelect />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/account" element={<AccountSelect />} />
        <Route path="/account/create" element={<AccountCreate />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/knowledge" element={<KnowledgeList />} />
          <Route path="/knowledge/:lessonId" element={<KnowledgeDetail />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/atlas/map" element={<MapAtlas />} />
          <Route path="/atlas/bio" element={<BioAtlas />} />
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
