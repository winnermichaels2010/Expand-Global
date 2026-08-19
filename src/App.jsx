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
import ActiveRequests from './pages/ActiveRequests';
import Payment from './pages/Payment';
import RemainingPayment from './pages/RemainingPayment';
import HalfPaidRequests from './pages/HalfPaidRequests';
import RejectedProjects from './pages/RejectedProjects';
import Gallery from './pages/Gallery';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
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
    const isAdmin = currentUser.email === 'winnermichael21dev@gmail.com';
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  }
  return <Home />;
}

function GalleryRoute() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return currentUser.email === 'winnermichael21dev@gmail.com'
      ? <Navigate to="/admin/gallery" replace />
      : <UserLayout><Gallery /></UserLayout>;
  }
  return <Gallery />;
}

function AppLayout() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = ['/dashboard', '/request-design', '/completed-projects', '/active-requests', '/half-paid-requests', '/rejected-projects'].includes(location.pathname) || location.pathname.startsWith('/payment/') || location.pathname.startsWith('/pay-remaining/');
  const isAuthedGallery = location.pathname === '/gallery' && !!currentUser;
  const showPublicLayout = !isAdminRoute && !isUserRoute && !isAuthedGallery;

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
          <Route path="/gallery" element={<GalleryRoute />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/projects/active" element={<AdminLayout><AdminProjects variant="active" /></AdminLayout>} />
          <Route path="/admin/projects/pending" element={<AdminLayout><AdminProjects variant="pending" /></AdminLayout>} />
          <Route path="/admin/projects/finished" element={<AdminLayout><AdminProjects variant="finished" /></AdminLayout>} />
          <Route path="/admin/projects/rejected" element={<AdminLayout><AdminRejectedRequests /></AdminLayout>} />
          <Route path="/admin/projects/reply/:id" element={<AdminLayout><AdminDesignRequestReply /></AdminLayout>} />
          <Route path="/admin/projects/submit/:id" element={<AdminLayout><AdminSubmitProject mode="submit" /></AdminLayout>} />
          <Route path="/admin/projects/view/:id" element={<AdminLayout><AdminSubmitProject mode="view" /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><Gallery /></AdminLayout>} />

          <Route path="/dashboard" element={<UserLayout><Dashboard /></UserLayout>} />
          <Route path="/request-design" element={<UserLayout><RequestDesign /></UserLayout>} />
          <Route path="/completed-projects" element={<UserLayout><CompletedProjects /></UserLayout>} />
          <Route path="/active-requests" element={<UserLayout><ActiveRequests /></UserLayout>} />
          <Route path="/half-paid-requests" element={<UserLayout><HalfPaidRequests /></UserLayout>} />
          <Route path="/payment/:id" element={<UserLayout><Payment /></UserLayout>} />
          <Route path="/pay-remaining/:id" element={<UserLayout><RemainingPayment /></UserLayout>} />
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
