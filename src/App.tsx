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
import PortfolioDetail from "./pages/PortfolioDetail";
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
 import AdminEmployees from "./pages/admin/AdminEmployees";
 import AdminAttendance from "./pages/admin/AdminAttendance";
 import AdminLeads from "./pages/admin/AdminLeads";
import ProtectedRoute from "./components/admin/ProtectedRoute";
 import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
 import AdminPayments from "./pages/admin/AdminPayments";
 import AdminRevenue from "./pages/admin/AdminRevenue";
 import AdminRoles from "./pages/admin/AdminRoles";
 import AdminNotes from "./pages/admin/AdminNotes";
 import AdminProducts from "./pages/admin/AdminProducts";
 import AdminProductDetail from "./pages/admin/AdminProductDetail";
 import AdminTasks from "./pages/admin/AdminTasks";
 import AdminNotifications from "./pages/admin/AdminNotifications";
 import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
 import AdminSettings from "./pages/admin/AdminSettings";
 import AdminPaymentGateway from "./pages/admin/AdminPaymentGateway";
 import AdminSMSSettings from "./pages/admin/AdminSMSSettings";
 import AdminSystemPreferences from "./pages/admin/AdminSystemPreferences";
 import AdminCMSHome from "./pages/admin/AdminCMSHome";
 import AdminCMSProducts from "./pages/admin/AdminCMSProducts";
 import AdminCMSServices from "./pages/admin/AdminCMSServices";
 import AdminCMSCompanies from "./pages/admin/AdminCMSCompanies";
 import AdminCMSResources from "./pages/admin/AdminCMSResources";
 import AdminCMSOther from "./pages/admin/AdminCMSOther";
 import AdminClientProfile from "./pages/admin/AdminClientProfile";

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
                  path="/admin/leads"
                  element={
                    <ProtectedRoute>
                      <AdminLeads />
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
                   path="/admin/clients/:id"
                   element={
                     <ProtectedRoute>
                       <AdminClientProfile />
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
                 <Route
                   path="/admin/employees"
                   element={
                     <ProtectedRoute>
                       <AdminEmployees />
                     </ProtectedRoute>
                   }
                 />
                <Route
                   path="/admin/attendance"
                   element={
                     <ProtectedRoute>
                       <AdminAttendance />
                     </ProtectedRoute>
                   }
                 />
 
                  {/* Finance */}
                  <Route
                    path="/admin/payments"
                    element={
                      <ProtectedRoute>
                        <AdminPayments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/revenue"
                    element={
                      <ProtectedRoute>
                        <AdminRevenue />
                      </ProtectedRoute>
                    }
                  />
 
                  {/* HR */}
                  <Route
                    path="/admin/roles"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminRoles />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notes"
                    element={
                      <ProtectedRoute>
                        <AdminNotes />
                      </ProtectedRoute>
                    }
                  />
 
                  {/* Products */}
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products/:slug"
                    element={
                      <ProtectedRoute>
                        <AdminProductDetail />
                      </ProtectedRoute>
                    }
                  />
 
                  {/* Frontend Control (CMS) */}
                  <Route
                    path="/admin/pages/home"
                    element={
                      <ProtectedRoute>
                        <AdminCMSHome />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pages/products"
                    element={
                      <ProtectedRoute>
                        <AdminCMSProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pages/services"
                    element={
                      <ProtectedRoute>
                        <AdminCMSServices />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pages/companies"
                    element={
                      <ProtectedRoute>
                        <AdminCMSCompanies />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pages/resources"
                    element={
                      <ProtectedRoute>
                        <AdminCMSResources />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pages/other"
                    element={
                      <ProtectedRoute>
                        <AdminCMSOther />
                      </ProtectedRoute>
                    }
                  />
 
                  {/* Operations */}
                  <Route
                    path="/admin/tasks"
                    element={
                      <ProtectedRoute>
                        <AdminTasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notifications"
                    element={
                      <ProtectedRoute>
                        <AdminNotifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/activity-logs"
                    element={
                      <ProtectedRoute>
                        <AdminActivityLogs />
                      </ProtectedRoute>
                    }
                  />
 
                  {/* Settings */}
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings/payment"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPaymentGateway />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings/sms"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminSMSSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings/system"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminSystemPreferences />
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
