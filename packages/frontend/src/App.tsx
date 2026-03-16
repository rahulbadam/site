import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import SafetyPage from './pages/SafetyPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;