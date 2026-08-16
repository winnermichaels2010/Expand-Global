import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import RequestDesign from './pages/RequestDesign';
import CompletedProjects from './pages/CompletedProjects';
import RejectedProjects from './pages/RejectedProjects';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDesignRequests from './pages/admin/AdminDesignRequests';
import AdminDesignRequestReply from './pages/admin/AdminDesignRequestReply';
import AdminRejectedRequests from './pages/admin/AdminRejectedRequests';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSubmitProject from './pages/admin/AdminSubmitProject';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function HomeRedirect() {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (currentUser) {
    const isAdmin = currentUser.email === 'adminemail@gmail.com';
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }
  return <Home />;
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = ['/dashboard', '/request-design', '/completed-projects', '/rejected-projects'].includes(location.pathname);
  const showPublicLayout = !isAdminRoute && !isUserRoute;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {showPublicLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/design-requests" element={<AdminLayout><AdminDesignRequests /></AdminLayout>} />
          <Route path="/admin/design-requests/rejected" element={<AdminLayout><AdminRejectedRequests /></AdminLayout>} />
          <Route path="/admin/design-requests/reply/:id" element={<AdminLayout><AdminDesignRequestReply /></AdminLayout>} />
          <Route path="/admin/projects/active" element={<AdminLayout><AdminProjects variant="active" /></AdminLayout>} />
          <Route path="/admin/projects/pending" element={<AdminLayout><AdminProjects variant="pending" /></AdminLayout>} />
          <Route path="/admin/projects/finished" element={<AdminLayout><AdminProjects variant="finished" /></AdminLayout>} />
          <Route path="/admin/projects/submit/:id" element={<AdminLayout><AdminSubmitProject mode="submit" /></AdminLayout>} />
          <Route path="/admin/projects/view/:id" element={<AdminLayout><AdminSubmitProject mode="view" /></AdminLayout>} />

          <Route path="/dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
          <Route path="/request-design" element={<UserLayout><RequestDesign /></UserLayout>} />
          <Route path="/completed-projects" element={<UserLayout><CompletedProjects /></UserLayout>} />
          <Route path="/rejected-projects" element={<UserLayout><RejectedProjects /></UserLayout>} />
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
