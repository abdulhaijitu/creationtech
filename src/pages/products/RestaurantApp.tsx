 import { Helmet } from 'react-helmet-async';
 import Layout from '@/components/layout/Layout';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Button } from '@/components/ui/button';
 import { Link } from 'react-router-dom';
 import { 
   ShoppingCart, 
   CreditCard, 
   BarChart3, 
   UtensilsCrossed, 
   Bell, 
   Smartphone,
   Check,
   ArrowRight,
   ChefHat,
   Receipt,
   Clock,
   Users
 } from 'lucide-react';
 import ScrollReveal from '@/components/common/ScrollReveal';
 import restaurantAppImg from '@/assets/products/restaurant-app.jpg';
 
 const RestaurantApp = () => {
   const { language } = useLanguage();
 
   const features = [
     {
       icon: ShoppingCart,
       title: 'Order Management',
       description: 'Handle dine-in, takeaway, and delivery orders from a single dashboard with real-time updates.'
     },
     {
       icon: UtensilsCrossed,
       title: 'Menu Management',
       description: 'Easy menu creation with categories, modifiers, combos, and dynamic pricing options.'
     },
     {
       icon: Receipt,
       title: 'POS & Billing',
       description: 'Fast checkout with split bills, discounts, tips, and multiple payment methods.'
     },
     {
       icon: ChefHat,
       title: 'Kitchen Display',
       description: 'Digital KDS for kitchen staff with order queue, preparation time, and status updates.'
     },
     {
       icon: Users,
       title: 'Table Management',
       description: 'Visual floor plan, table status tracking, reservations, and waitlist management.'
     },
     {
       icon: BarChart3,
       title: 'Sales Analytics',
       description: 'Track sales, popular items, peak hours, and staff performance with detailed reports.'
     },
   ];
 
   const benefits = [
     'Reduce order errors by 80%',
     'Speed up table turnover',
     'Real-time inventory tracking',
     'Customer loyalty program',
     'Online ordering integration',
     'Multi-outlet support'
   ];
 
   return (
     <>
       <Helmet>
         <title>Restaurant App - Modern POS & Order Management | Creation Tech</title>
         <meta
           name="description"
           content="Restaurant App is a modern POS and order management system for restaurants, cafes, and food businesses. Streamline operations and delight customers."
         />
       </Helmet>
       <Layout>
         {/* Hero Section */}
         <section className="relative py-20 lg:py-28 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-primary/5" />
           <div className="container-custom relative">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <ScrollReveal>
                 <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium">
                     <ChefHat className="h-4 w-4" />
                     <span>Restaurant Solution</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                     Restaurant App
                   </h1>
                   <p className="text-xl text-muted-foreground max-w-lg">
                     The all-in-one POS and restaurant management system that helps you serve customers better.
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
                   <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-primary/20 rounded-2xl blur-2xl opacity-50" />
                   <img
                     src={restaurantAppImg}
                     alt="Restaurant App Dashboard"
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
                   Everything Your Restaurant Needs
                 </h2>
                 <p className="text-lg text-muted-foreground">
                   From taking orders to analyzing sales, manage every aspect of your food business.
                 </p>
               </div>
             </ScrollReveal>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {features.map((feature, index) => (
                 <ScrollReveal key={feature.title} delay={index * 0.1}>
                   <div className="group p-6 rounded-xl bg-card border border-border hover:border-orange-500/50 hover:shadow-lg transition-all duration-300">
                     <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                       <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
                     Built for Food Business Success
                   </h2>
                   <p className="text-lg text-muted-foreground">
                     Whether you run a small cafe or a multi-outlet restaurant chain, we've got you covered.
                   </p>
                   <div className="grid sm:grid-cols-2 gap-4 pt-4">
                     {benefits.map((benefit) => (
                       <div key={benefit} className="flex items-start gap-3">
                         <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <Check className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                         </div>
                         <span className="text-foreground">{benefit}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </ScrollReveal>
               <ScrollReveal delay={0.2}>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-xl bg-orange-500 text-white text-center">
                     <div className="text-4xl font-bold mb-2">100+</div>
                     <div className="text-sm opacity-90">Restaurants</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                     <div className="text-sm text-muted-foreground">Orders Processed</div>
                   </div>
                   <div className="p-6 rounded-xl bg-card border border-border text-center">
                     <div className="text-4xl font-bold text-primary mb-2">30%</div>
                     <div className="text-sm text-muted-foreground">Faster Service</div>
                   </div>
                   <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
                     <div className="text-4xl font-bold mb-2">24/7</div>
                     <div className="text-sm opacity-90">Support</div>
                   </div>
                 </div>
               </ScrollReveal>
             </div>
           </div>
         </section>
 
         {/* CTA Section */}
         <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
           <div className="container-custom">
             <ScrollReveal>
               <div className="text-center max-w-3xl mx-auto space-y-6">
                 <h2 className="text-3xl md:text-4xl font-bold">
                   Ready to Modernize Your Restaurant?
                 </h2>
                 <p className="text-lg opacity-90">
                   Start serving customers better with our modern restaurant management system.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <Button size="lg" variant="secondary" asChild>
                     <Link to="/contact">
                       Get Started
                       <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                   <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
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
 
 export default RestaurantApp;