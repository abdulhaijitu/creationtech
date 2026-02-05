 import { Helmet } from 'react-helmet-async';
 import Layout from '@/components/layout/Layout';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Button } from '@/components/ui/button';
 import { Link } from 'react-router-dom';
 import { 
   Users, 
   Wallet, 
   BarChart3, 
   FileText, 
   Shield, 
   Smartphone,
   Check,
   ArrowRight,
   Building2,
   Calculator,
   PiggyBank,
   Receipt
 } from 'lucide-react';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import somityAppImg from '@/assets/products/somity-app.jpg';
 
 const SomityApp = () => {
   const { language } = useLanguage();
 
   const features = [
     {
       icon: Users,
       title: 'Member Management',
       description: 'Complete member database with shares, loans, deposits, and transaction history tracking.'
     },
     {
       icon: PiggyBank,
       title: 'Savings & Deposits',
       description: 'Multiple savings schemes, recurring deposits, fixed deposits with automatic interest calculation.'
     },
     {
       icon: Wallet,
       title: 'Loan Management',
       description: 'Issue loans, track repayments, manage interest rates, and handle loan guarantors.'
     },
     {
       icon: Calculator,
       title: 'Share Management',
       description: 'Track member shares, dividends, and share transfers with complete audit trails.'
     },
     {
       icon: Receipt,
       title: 'Collection System',
       description: 'Field collection with mobile app, real-time sync, and collector performance tracking.'
     },
     {
       icon: BarChart3,
       title: 'Reports & Analytics',
       description: 'Comprehensive financial reports, member statements, and regulatory compliance reports.'
     },
   ];
 
   const benefits = [
     'Paperless operations',
     'Mobile collection app',
     'Automated interest calculation',
     'Real-time financial reports',
     'Multi-branch support',
     'Regulatory compliance ready'
   ];
 
   return (
     <>
       <Helmet>
         <title>Somity App - Cooperative Society Management | Creation Tech</title>
         <meta
           name="description"
           content="Somity App is a digital platform for cooperative society and microfinance management. Manage members, loans, savings, and collections efficiently."
         />
       </Helmet>
       <Layout>
         {/* Hero Section */}
         <section className="relative py-20 lg:py-28 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
           <div className="container-custom relative">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <ScrollReveal>
                 <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium">
                     <Building2 className="h-4 w-4" />
                     <span>Cooperative Solution</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                     Somity App
                   </h1>
                   <p className="text-xl text-muted-foreground max-w-lg">
                     The complete digital platform for cooperative societies, microfinance institutions, and savings groups.
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
                   <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-50" />
                   <img
                     src={somityAppImg}
                     alt="Somity App Dashboard"
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
                   Complete Cooperative Management
                 </h2>
                 <p className="text-lg text-muted-foreground">
                   Everything you need to run your somity, samabay, or microfinance organization.
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {features.map((feature, index) => (
                 <ScrollReveal key={feature.title} delay={index * 0.1}>
                   <div className="group p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                     <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                       <feature.icon className="h-6 w-6 text-accent-foreground" />
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
                     Trusted by Cooperatives Nationwide
                   </h2>
                   <p className="text-lg text-muted-foreground">
                     From small village samities to large cooperative societies, our platform scales with your needs.
                   </p>
                   <div className="grid sm:grid-cols-2 gap-4 pt-4">
                     {benefits.map((benefit) => (
                       <div key={benefit} className="flex items-start gap-3">
                         <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <Check className="h-4 w-4 text-accent-foreground" />
                         </div>
                         <span className="text-foreground">{benefit}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal delay={0.2}>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-xl bg-accent text-accent-foreground text-center">
                     <div className="text-4xl font-bold mb-2">200+</div>
                     <div className="text-sm opacity-90">Active Somities</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                     <div className="text-sm text-muted-foreground">Members Managed</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">৳100Cr+</div>
                     <div className="text-sm text-muted-foreground">Transactions Processed</div>
                   </div>
                   <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
                     <div className="text-4xl font-bold mb-2">64</div>
                     <div className="text-sm opacity-90">Districts Covered</div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>
         </section>
 
         {/* CTA Section */}
         <section className="py-20 bg-accent text-accent-foreground">
           <div className="container-custom">
             <ScrollReveal>
               <div className="text-center max-w-3xl mx-auto space-y-6">
                 <h2 className="text-3xl md:text-4xl font-bold">
                   Digitize Your Cooperative Today
                 </h2>
                 <p className="text-lg opacity-90">
                   Join the digital revolution and make your somity operations efficient and transparent.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <Button size="lg" variant="secondary" asChild>
                     <Link to="/contact">
                       Get Started
                       <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                   <Button size="lg" variant="outline" className="border-accent-foreground/30 hover:bg-accent-foreground/10" asChild>
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
 
 export default SomityApp;