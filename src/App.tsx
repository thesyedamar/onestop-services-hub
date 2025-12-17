import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Customer Pages
import CustomerHome from "./pages/customer/CustomerHome";
import CategoryServices from "./pages/customer/CategoryServices";
import ServiceDetail from "./pages/customer/ServiceDetail";
import BookingStatus from "./pages/customer/BookingStatus";
import Bookings from "./pages/customer/Bookings";
import Profile from "./pages/customer/Profile";

// Provider Pages
import ProviderRequests from "./pages/provider/ProviderRequests";
import ProviderJobs from "./pages/provider/ProviderJobs";
import ProviderEarnings from "./pages/provider/ProviderEarnings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  
  // Show nothing while loading auth state
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate home based on role
    if (role === 'provider') return <Navigate to="/provider/requests" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Customer Routes */}
      <Route path="/home" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerHome />
        </ProtectedRoute>
      } />
      <Route path="/category/:categoryId" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CategoryServices />
        </ProtectedRoute>
      } />
      <Route path="/service/:serviceId" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <ServiceDetail />
        </ProtectedRoute>
      } />
      <Route path="/booking-status" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <BookingStatus />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Bookings />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Provider Routes */}
      <Route path="/provider/requests" element={
        <ProtectedRoute allowedRoles={['provider']}>
          <ProviderRequests />
        </ProtectedRoute>
      } />
      <Route path="/provider/jobs" element={
        <ProtectedRoute allowedRoles={['provider']}>
          <ProviderJobs />
        </ProtectedRoute>
      } />
      <Route path="/provider/earnings" element={
        <ProtectedRoute allowedRoles={['provider']}>
          <ProviderEarnings />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminBookings />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
