 import { Helmet } from 'react-helmet-async';
 import Layout from '@/components/layout/Layout';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Button } from '@/components/ui/button';
 import { Link } from 'react-router-dom';
 import { 
   Users, 
   CreditCard, 
   BarChart3, 
   Wifi, 
   Shield, 
   Clock,
   Check,
   ArrowRight,
   Server,
   Bell,
   FileText
 } from 'lucide-react';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import ispManagerImg from '@/assets/products/isp-manager.jpg';
 
 const ISPManager = () => {
   const { language } = useLanguage();
 
   const features = [
     {
       icon: Users,
       title: 'Customer Management',
       description: 'Complete subscriber database with detailed profiles, connection history, and service records.'
     },
     {
       icon: CreditCard,
       title: 'Automated Billing',
       description: 'Generate invoices, track payments, send reminders, and manage multiple billing cycles effortlessly.'
     },
     {
       icon: BarChart3,
       title: 'Revenue Analytics',
       description: 'Real-time dashboards showing revenue trends, collection rates, and financial forecasts.'
     },
     {
       icon: Wifi,
       title: 'Bandwidth Control',
       description: 'Allocate and monitor bandwidth per user, implement FUP policies, and manage traffic shaping.'
     },
     {
       icon: Shield,
       title: 'Security & Access',
       description: 'Role-based access control, audit logs, and secure data encryption for all transactions.'
     },
     {
       icon: Bell,
       title: 'SMS & Notifications',
       description: 'Automated SMS alerts for due dates, service updates, and promotional campaigns.'
     },
   ];
 
   const benefits = [
     'Reduce billing errors by 95%',
     'Save 20+ hours weekly on manual tasks',
     'Increase collection rate by 40%',
     'Real-time customer support tools',
     'Multi-branch management support',
     'Mobile app for field technicians'
   ];
 
   return (
     <>
       <Helmet>
          <title>ISP Management Software - Internet Billing System | Creation Tech</title>
         <meta
           name="description"
            content="Complete ISP management software with internet billing system, ISP client management, bandwidth control, and network management. Automate your ISP operations in Bangladesh."
         />
          <meta name="keywords" content="ISP management software, internet billing system, ISP client management, network management software, bandwidth control" />
          <link rel="canonical" href="https://creationtechbd.com/products/isp-manager" />
       </Helmet>
       <Layout>
         {/* Hero Section */}
         <section className="relative py-20 lg:py-28 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
           <div className="container-custom relative">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <ScrollReveal>
                 <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                     <Server className="h-4 w-4" />
                     <span>ISP Solution</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      ISP Management Software
                   </h1>
                   <p className="text-xl text-muted-foreground max-w-lg">
                      Complete internet billing system and network management software for ISPs in Bangladesh.
                   </p>
                   <div className="flex flex-wrap gap-4 pt-4">
                     <Button size="lg" asChild>
                       <Link to="/contact">
                         Request Demo
                         <ArrowRight className="ml-2 h-4 w-4" />
                       </Link>
                     </Button>
                     <Button size="lg" variant="outline" asChild>
                       <Link to="/contact#schedule">Schedule a Call</Link>
                     </Button>
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal delay={0.2}>
                 <div className="relative">
                   <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl opacity-50" />
                   <img
                     src={ispManagerImg}
                     alt="ISP Manager Dashboard"
                     className="relative rounded-2xl shadow-2xl w-full"
                   />
                 </div>
               </ScrollReveal>
             </div>
           </div>
         </section>
 
         {/* Features Section */}
         <section className="py-20 bg-muted/30">
           <div className="container-custom">
             <ScrollReveal>
               <div className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
                   Everything You Need to Run Your ISP
                 </h2>
                 <p className="text-lg text-muted-foreground">
                   From subscriber management to automated billing, ISP Manager handles it all.
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {features.map((feature, index) => (
                 <ScrollReveal key={feature.title} delay={index * 0.1}>
                   <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                     <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                       <feature.icon className="h-6 w-6 text-primary" />
                     </div>
                     <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                     <p className="text-muted-foreground">{feature.description}</p>
                   </div>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </section>
 
         {/* Benefits Section */}
         <section className="py-20">
           <div className="container-custom">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <ScrollReveal>
                 <div className="space-y-6">
                   <h2 className="text-3xl md:text-4xl font-bold">
                     Why ISPs Choose Us
                   </h2>
                   <p className="text-lg text-muted-foreground">
                     Join hundreds of ISPs across Bangladesh who have transformed their operations with ISP Manager.
                   </p>
                   <div className="grid sm:grid-cols-2 gap-4 pt-4">
                     {benefits.map((benefit) => (
                       <div key={benefit} className="flex items-start gap-3">
                         <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <Check className="h-4 w-4 text-primary" />
                         </div>
                         <span className="text-foreground">{benefit}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal delay={0.2}>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
                     <div className="text-4xl font-bold mb-2">500+</div>
                     <div className="text-sm opacity-90">Active ISPs</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                     <div className="text-sm text-muted-foreground">Subscribers Managed</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                     <div className="text-sm text-muted-foreground">Uptime</div>
                   </div>
                   <div className="p-6 rounded-xl bg-accent text-accent-foreground text-center">
                     <div className="text-4xl font-bold mb-2">24/7</div>
                     <div className="text-sm opacity-90">Support</div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>
         </section>
 
         {/* CTA Section */}
         <section className="py-20 bg-primary text-primary-foreground">
           <div className="container-custom">
             <ScrollReveal>
               <div className="text-center max-w-3xl mx-auto space-y-6">
                 <h2 className="text-3xl md:text-4xl font-bold">
                   Ready to Transform Your ISP Business?
                 </h2>
                 <p className="text-lg opacity-90">
                   Get started with ISP Manager today and see the difference in your operations.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <Button size="lg" variant="secondary" asChild>
                     <Link to="/contact">
                       Get Started
                       <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                   <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                     <Link to="/contact#schedule">Talk to Sales</Link>
                   </Button>
                 </div>
               </div>
             </ScrollReveal>
           </div>
         </section>
       </Layout>
     </>
   );
 };
 
 export default ISPManager;