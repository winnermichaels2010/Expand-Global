import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import RequestDesign from './pages/RequestDesign';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDesignRequests from './pages/admin/AdminDesignRequests';
import AdminDesignRequestReply from './pages/admin/AdminDesignRequestReply';
import AdminSettings from './pages/admin/AdminSettings';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = ['/dashboard', '/request-design', '/settings'].includes(location.pathname);
  const showPublicLayout = !isAdminRoute && !isUserRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {showPublicLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/design-requests" element={<AdminLayout><AdminDesignRequests /></AdminLayout>} />
          <Route path="/admin/design-requests/reply/:id" element={<AdminLayout><AdminDesignRequestReply /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          <Route path="/dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
          <Route path="/request-design" element={<UserLayout><RequestDesign /></UserLayout>} />
          <Route path="/settings" element={<UserLayout><Settings /></UserLayout>} />
        </Routes>
      </main>
      {showPublicLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
