import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";

// Eagerly loaded (landing page)
import Index from "./pages/Index";

// Lazy-loaded public pages
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Products = lazy(() => import("./pages/Products"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded product pages
const ISPManager = lazy(() => import("./pages/products/ISPManager"));
const SomityApp = lazy(() => import("./pages/products/SomityApp"));
const RestaurantApp = lazy(() => import("./pages/products/RestaurantApp"));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminPortfolio = lazy(() => import("./pages/admin/AdminPortfolio"));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminClientProfile = lazy(() => import("./pages/admin/AdminClientProfile"));
const AdminQuotations = lazy(() => import("./pages/admin/AdminQuotations"));
const AdminProposals = lazy(() => import("./pages/admin/AdminProposals"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminRoles = lazy(() => import("./pages/admin/AdminRoles"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductDetail = lazy(() => import("./pages/admin/AdminProductDetail"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPaymentGateway = lazy(() => import("./pages/admin/AdminPaymentGateway"));
const AdminSMSSettings = lazy(() => import("./pages/admin/AdminSMSSettings"));
const AdminSystemPreferences = lazy(() => import("./pages/admin/AdminSystemPreferences"));
const AdminSisterConcerns = lazy(() => import("./pages/admin/AdminSisterConcerns"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
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
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                  <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
                  <Route path="/admin/careers" element={<ProtectedRoute><AdminCareers /></ProtectedRoute>} />
                  <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
                  <Route path="/admin/invoices" element={<ProtectedRoute><AdminInvoices /></ProtectedRoute>} />
                  <Route path="/admin/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
                  <Route path="/admin/clients/:id" element={<ProtectedRoute><AdminClientProfile /></ProtectedRoute>} />
                  <Route path="/admin/quotations" element={<ProtectedRoute><AdminQuotations /></ProtectedRoute>} />
                  <Route path="/admin/proposals" element={<ProtectedRoute><AdminProposals /></ProtectedRoute>} />
                  <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
                  <Route path="/admin/roles" element={<ProtectedRoute requiredRole="admin"><AdminRoles /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
                  <Route path="/admin/products/:slug" element={<ProtectedRoute><AdminProductDetail /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
                  <Route path="/admin/settings/payment" element={<ProtectedRoute requiredRole="admin"><AdminPaymentGateway /></ProtectedRoute>} />
                  <Route path="/admin/settings/sms" element={<ProtectedRoute requiredRole="admin"><AdminSMSSettings /></ProtectedRoute>} />
                  <Route path="/admin/settings/system" element={<ProtectedRoute requiredRole="admin"><AdminSystemPreferences /></ProtectedRoute>} />
                  <Route path="/admin/sister-concerns" element={<ProtectedRoute><AdminSisterConcerns /></ProtectedRoute>} />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
