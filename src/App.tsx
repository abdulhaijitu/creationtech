import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import Pricing from "./pages/Pricing";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Cookies from "./pages/Cookies";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

// Product pages
import ISPManager from "./pages/products/ISPManager";
import SomityApp from "./pages/products/SomityApp";
import RestaurantApp from "./pages/products/RestaurantApp";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBusinessInfo from "./pages/admin/AdminBusinessInfo";
import AdminPages from "./pages/admin/AdminPages";
import AdminServices from "./pages/admin/AdminServices";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminCareers from "./pages/admin/AdminCareers";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminMeetings from "./pages/admin/AdminMeetings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminClients from "./pages/admin/AdminClients";
 import AdminQuotations from "./pages/admin/AdminQuotations";
 import AdminProposals from "./pages/admin/AdminProposals";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/isp-manager" element={<ISPManager />} />
                <Route path="/products/somity-app" element={<SomityApp />} />
                <Route path="/products/restaurant-app" element={<RestaurantApp />} />
                
                {/* Legal Pages */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/cookies" element={<Cookies />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/business-info"
                  element={
                    <ProtectedRoute>
                      <AdminBusinessInfo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pages"
                  element={
                    <ProtectedRoute>
                      <AdminPages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/services"
                  element={
                    <ProtectedRoute>
                      <AdminServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/portfolio"
                  element={
                    <ProtectedRoute>
                      <AdminPortfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog"
                  element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/careers"
                  element={
                    <ProtectedRoute>
                      <AdminCareers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads/contacts"
                  element={
                    <ProtectedRoute>
                      <AdminContacts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads/quotes"
                  element={
                    <ProtectedRoute>
                      <AdminQuotes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/leads/meetings"
                  element={
                    <ProtectedRoute>
                      <AdminMeetings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/testimonials"
                  element={
                    <ProtectedRoute>
                      <AdminTestimonials />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/invoices"
                  element={
                    <ProtectedRoute>
                      <AdminInvoices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/clients"
                  element={
                    <ProtectedRoute>
                      <AdminClients />
                    </ProtectedRoute>
                  }
                />
                 <Route
                   path="/admin/quotations"
                   element={
                     <ProtectedRoute>
                       <AdminQuotations />
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/admin/proposals"
                   element={
                     <ProtectedRoute>
                       <AdminProposals />
                     </ProtectedRoute>
                   }
                 />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
