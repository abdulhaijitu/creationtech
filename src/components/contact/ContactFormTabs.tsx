 import { useState } from 'react';
 import { Link } from 'react-router-dom';
 import { 
   Send, MessageSquare, FileText, Calendar, ArrowRight, 
   User, Mail, Phone, Building2, DollarSign, FileQuestion, Clock as ClockIcon
 } from 'lucide-react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';
 import { cn } from '@/lib/utils';
 
 interface ContactFormTabsProps {
   language: 'en' | 'bn';
   defaultTab?: string;
   services: Array<{ value: string; labelEn: string; labelBn: string }>;
 }
 
 interface FormFieldProps {
   id: string;
   label: string;
   required?: boolean;
   icon?: React.ElementType;
   children: React.ReactNode;
 }
 
 const FormField = ({ id, label, required, icon: Icon, children }: FormFieldProps) => (
   <div className="space-y-2">
     <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-foreground">
       {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
       {label} {required && <span className="text-destructive">*</span>}
     </Label>
     {children}
   </div>
 );
 
 const ContactFormTabs = ({ language, defaultTab = 'contact', services }: ContactFormTabsProps) => {
   const { toast } = useToast();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [activeTab, setActiveTab] = useState(defaultTab);
 
   // Form states
   const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
   const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', details: '' });
   const [meetingForm, setMeetingForm] = useState({ name: '', email: '', phone: '', company: '', date: '', time: '', topic: '', notes: '' });
 
   const handleContactSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
       const { error } = await supabase.from('contact_submissions').insert({
         full_name: contactForm.name,
         email: contactForm.email,
         phone: contactForm.phone || null,
         subject: contactForm.subject,
         message: contactForm.message,
       });
       if (error) throw error;
       toast({
         title: language === 'en' ? 'Message Sent!' : 'বার্তা পাঠানো হয়েছে!',
         description: language === 'en'
           ? 'Thank you for reaching out. We will get back to you soon.'
           : 'যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
       });
       setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
     } catch {
       toast({
         title: language === 'en' ? 'Error' : 'ত্রুটি',
         description: language === 'en' ? 'Failed to send message. Please try again.' : 'বার্তা পাঠাতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handleQuoteSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
       const { error } = await supabase.from('quote_requests').insert({
         full_name: quoteForm.name,
         email: quoteForm.email,
         phone: quoteForm.phone || null,
         company: quoteForm.company || null,
         service_interest: quoteForm.service,
         budget: quoteForm.budget || null,
         project_details: quoteForm.details,
       });
       if (error) throw error;
       toast({
         title: language === 'en' ? 'Quote Request Sent!' : 'কোটেশনের অনুরোধ পাঠানো হয়েছে!',
         description: language === 'en'
           ? 'We will review your requirements and get back to you shortly.'
           : 'আমরা আপনার প্রয়োজনীয়তা পর্যালোচনা করব এবং শীঘ্রই আপনার সাথে যোগাযোগ করব।',
       });
       setQuoteForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', details: '' });
     } catch {
       toast({
         title: language === 'en' ? 'Error' : 'ত্রুটি',
         description: language === 'en' ? 'Failed to submit quote request. Please try again.' : 'কোটেশনের অনুরোধ জমা দিতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const handleMeetingSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
       const { error } = await supabase.from('meeting_requests').insert({
         full_name: meetingForm.name,
         email: meetingForm.email,
         phone: meetingForm.phone,
         company: meetingForm.company || null,
         preferred_date: meetingForm.date,
         preferred_time: meetingForm.time,
         meeting_topic: meetingForm.topic,
         additional_notes: meetingForm.notes || null,
       });
       if (error) throw error;
       toast({
         title: language === 'en' ? 'Meeting Requested!' : 'মিটিংয়ের অনুরোধ করা হয়েছে!',
         description: language === 'en'
           ? 'We will confirm your meeting schedule shortly.'
           : 'আমরা শীঘ্রই আপনার মিটিং সময়সূচী নিশ্চিত করব।',
       });
       setMeetingForm({ name: '', email: '', phone: '', company: '', date: '', time: '', topic: '', notes: '' });
     } catch {
       toast({
         title: language === 'en' ? 'Error' : 'ত্রুটি',
         description: language === 'en' ? 'Failed to book meeting. Please try again.' : 'মিটিং বুক করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const tabConfig = [
     { value: 'contact', icon: MessageSquare, labelEn: 'Contact', labelBn: 'যোগাযোগ' },
     { value: 'quote', icon: FileText, labelEn: 'Get Quote', labelBn: 'কোটেশন' },
     { value: 'meeting', icon: Calendar, labelEn: 'Book Meeting', labelBn: 'মিটিং' },
   ];
 
   return (
     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
       {/* Premium Tab List */}
       <TabsList className="mb-6 grid w-full grid-cols-3 rounded-2xl bg-muted/60 p-1.5 h-auto border border-border/50">
         {tabConfig.map((tab) => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.value;
           return (
             <TabsTrigger
               key={tab.value}
               value={tab.value}
               className={cn(
                 "relative flex items-center justify-center gap-2 rounded-xl px-3 py-3.5 text-sm font-medium transition-all duration-300",
                 "data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-foreground",
                 "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80"
               )}
             >
               <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
               <span className="hidden sm:inline">{language === 'en' ? tab.labelEn : tab.labelBn}</span>
             </TabsTrigger>
           );
         })}
       </TabsList>
 
       {/* Contact Form */}
       <TabsContent value="contact" className="mt-0">
         <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
           <CardHeader className="pb-4 pt-6">
             <CardTitle className="text-xl font-semibold flex items-center gap-2">
               <MessageSquare className="h-5 w-5 text-primary" />
               {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
             </CardTitle>
             <CardDescription className="text-muted-foreground">
               {language === 'en'
                 ? "Have a question? We'd love to hear from you."
                 : 'প্রশ্ন আছে? আমরা আপনার কাছ থেকে শুনতে চাই।'}
             </CardDescription>
           </CardHeader>
           <CardContent className="pb-6">
             <form onSubmit={handleContactSubmit} className="space-y-5">
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="contact-name" label={language === 'en' ? 'Full Name' : 'পুরো নাম'} required icon={User}>
                   <Input
                     id="contact-name"
                     value={contactForm.name}
                     onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                     placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="contact-email" label={language === 'en' ? 'Email' : 'ইমেইল'} required icon={Mail}>
                   <Input
                     id="contact-email"
                     type="email"
                     value={contactForm.email}
                     onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                     placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="contact-phone" label={language === 'en' ? 'Phone' : 'ফোন'} icon={Phone}>
                   <Input
                     id="contact-phone"
                     type="tel"
                     value={contactForm.phone}
                     onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                     placeholder="+880 1XXX-XXXXXX"
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="contact-subject" label={language === 'en' ? 'Subject' : 'বিষয়'} required icon={FileQuestion}>
                   <Input
                     id="contact-subject"
                     value={contactForm.subject}
                     onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                     placeholder={language === 'en' ? 'How can we help?' : 'আমরা কিভাবে সাহায্য করতে পারি?'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <FormField id="contact-message" label={language === 'en' ? 'Message' : 'বার্তা'} required icon={MessageSquare}>
                 <Textarea
                   id="contact-message"
                   rows={4}
                   value={contactForm.message}
                   onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                   placeholder={language === 'en' ? 'Tell us more about your inquiry...' : 'আপনার প্রশ্ন সম্পর্কে বিস্তারিত বলুন...'}
                   required
                   className="resize-none bg-background/50 border-border/60 focus:bg-background transition-colors"
                 />
               </FormField>
               <Button
                 type="submit"
                 size="lg"
                 className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                 disabled={isSubmitting}
               >
                 <Send className="h-4 w-4" />
                 {isSubmitting
                   ? (language === 'en' ? 'Sending...' : 'পাঠানো হচ্ছে...')
                   : (language === 'en' ? 'Send Message' : 'বার্তা পাঠান')}
               </Button>
             </form>
           </CardContent>
         </Card>
       </TabsContent>
 
       {/* Quote Form */}
       <TabsContent value="quote" className="mt-0">
         <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
           <CardHeader className="pb-4 pt-6">
             <CardTitle className="text-xl font-semibold flex items-center gap-2">
               <FileText className="h-5 w-5 text-primary" />
               {language === 'en' ? 'Request a Quote' : 'কোটেশনের অনুরোধ'}
             </CardTitle>
             <CardDescription className="text-muted-foreground">
               {language === 'en'
                 ? 'Tell us about your project and we will provide a detailed quote.'
                 : 'আপনার প্রকল্প সম্পর্কে বলুন এবং আমরা একটি বিস্তারিত কোটেশন প্রদান করব।'}
             </CardDescription>
           </CardHeader>
           <CardContent className="pb-6">
             <form onSubmit={handleQuoteSubmit} className="space-y-5">
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="quote-name" label={language === 'en' ? 'Full Name' : 'পুরো নাম'} required icon={User}>
                   <Input
                     id="quote-name"
                     value={quoteForm.name}
                     onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                     placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="quote-email" label={language === 'en' ? 'Email' : 'ইমেইল'} required icon={Mail}>
                   <Input
                     id="quote-email"
                     type="email"
                     value={quoteForm.email}
                     onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                     placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="quote-phone" label={language === 'en' ? 'Phone' : 'ফোন'} icon={Phone}>
                   <Input
                     id="quote-phone"
                     type="tel"
                     value={quoteForm.phone}
                     onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                     placeholder="+880 1XXX-XXXXXX"
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="quote-company" label={language === 'en' ? 'Company' : 'কোম্পানি'} icon={Building2}>
                   <Input
                     id="quote-company"
                     value={quoteForm.company}
                     onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                     placeholder={language === 'en' ? 'Your Company' : 'আপনার কোম্পানি'}
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="quote-service" label={language === 'en' ? 'Service Interest' : 'সেবা'} required icon={FileText}>
                   <select
                     id="quote-service"
                     className="flex h-12 w-full rounded-lg border border-border/60 bg-background/50 px-4 py-2.5 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:bg-background"
                     value={quoteForm.service}
                     onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                     required
                   >
                     <option value="">{language === 'en' ? 'Select a service' : 'সেবা নির্বাচন করুন'}</option>
                     {services.map((service) => (
                       <option key={service.value} value={service.value}>
                         {language === 'en' ? service.labelEn : service.labelBn}
                       </option>
                     ))}
                   </select>
                 </FormField>
                 <FormField id="quote-budget" label={language === 'en' ? 'Estimated Budget' : 'আনুমানিক বাজেট'} icon={DollarSign}>
                   <Input
                     id="quote-budget"
                     placeholder={language === 'en' ? 'e.g., $5,000 - $10,000' : 'যেমন, ৫০,০০০ - ১,০০,০০০ টাকা'}
                     value={quoteForm.budget}
                     onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <FormField id="quote-details" label={language === 'en' ? 'Project Details' : 'প্রকল্পের বিবরণ'} required icon={FileQuestion}>
                 <Textarea
                   id="quote-details"
                   rows={4}
                   value={quoteForm.details}
                   onChange={(e) => setQuoteForm({ ...quoteForm, details: e.target.value })}
                   placeholder={language === 'en' ? 'Describe your project requirements...' : 'আপনার প্রকল্পের প্রয়োজনীয়তা বর্ণনা করুন...'}
                   required
                   className="resize-none bg-background/50 border-border/60 focus:bg-background transition-colors"
                 />
               </FormField>
               <Button
                 type="submit"
                 size="lg"
                 className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                 disabled={isSubmitting}
               >
                 <ArrowRight className="h-4 w-4" />
                 {isSubmitting
                   ? (language === 'en' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...')
                   : (language === 'en' ? 'Get Free Quote' : 'বিনামূল্যে কোটেশন পান')}
               </Button>
             </form>
           </CardContent>
         </Card>
       </TabsContent>
 
       {/* Meeting Form */}
       <TabsContent value="meeting" className="mt-0">
         <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
           <CardHeader className="pb-4 pt-6">
             <CardTitle className="text-xl font-semibold flex items-center gap-2">
               <Calendar className="h-5 w-5 text-primary" />
               {language === 'en' ? 'Book a Meeting' : 'মিটিং বুক করুন'}
             </CardTitle>
             <CardDescription className="text-muted-foreground">
               {language === 'en'
                 ? 'Schedule a consultation with our team.'
                 : 'আমাদের দলের সাথে একটি পরামর্শ সিডিউল করুন।'}
             </CardDescription>
           </CardHeader>
           <CardContent className="pb-6">
             <form onSubmit={handleMeetingSubmit} className="space-y-5">
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="meeting-name" label={language === 'en' ? 'Full Name' : 'পুরো নাম'} required icon={User}>
                   <Input
                     id="meeting-name"
                     value={meetingForm.name}
                     onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                     placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="meeting-email" label={language === 'en' ? 'Email' : 'ইমেইল'} required icon={Mail}>
                   <Input
                     id="meeting-email"
                     type="email"
                     value={meetingForm.email}
                     onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                     placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="meeting-phone" label={language === 'en' ? 'Phone' : 'ফোন'} required icon={Phone}>
                   <Input
                     id="meeting-phone"
                     type="tel"
                     value={meetingForm.phone}
                     onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                     placeholder="+880 1XXX-XXXXXX"
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="meeting-company" label={language === 'en' ? 'Company' : 'কোম্পানি'} icon={Building2}>
                   <Input
                     id="meeting-company"
                     value={meetingForm.company}
                     onChange={(e) => setMeetingForm({ ...meetingForm, company: e.target.value })}
                     placeholder={language === 'en' ? 'Your Company' : 'আপনার কোম্পানি'}
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <div className="grid gap-5 sm:grid-cols-2">
                 <FormField id="meeting-date" label={language === 'en' ? 'Preferred Date' : 'পছন্দের তারিখ'} required icon={Calendar}>
                   <Input
                     id="meeting-date"
                     type="date"
                     value={meetingForm.date}
                     onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
                 <FormField id="meeting-time" label={language === 'en' ? 'Preferred Time' : 'পছন্দের সময়'} required icon={ClockIcon}>
                   <Input
                     id="meeting-time"
                     type="time"
                     value={meetingForm.time}
                     onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                     required
                     className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                   />
                 </FormField>
               </div>
               <FormField id="meeting-topic" label={language === 'en' ? 'Meeting Topic' : 'মিটিংয়ের বিষয়'} required icon={MessageSquare}>
                 <Input
                   id="meeting-topic"
                   value={meetingForm.topic}
                   onChange={(e) => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                   placeholder={language === 'en' ? 'What would you like to discuss?' : 'আপনি কি আলোচনা করতে চান?'}
                   required
                   className="h-12 bg-background/50 border-border/60 focus:bg-background transition-colors"
                 />
               </FormField>
               <FormField id="meeting-notes" label={language === 'en' ? 'Additional Notes' : 'অতিরিক্ত নোট'} icon={FileQuestion}>
                 <Textarea
                   id="meeting-notes"
                   rows={3}
                   value={meetingForm.notes}
                   onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                   placeholder={language === 'en' ? 'Any additional information...' : 'অতিরিক্ত তথ্য...'}
                   className="resize-none bg-background/50 border-border/60 focus:bg-background transition-colors"
                 />
               </FormField>
               <Button
                 type="submit"
                 size="lg"
                 className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                 disabled={isSubmitting}
               >
                 <Calendar className="h-4 w-4" />
                 {isSubmitting
                   ? (language === 'en' ? 'Booking...' : 'বুক করা হচ্ছে...')
                   : (language === 'en' ? 'Book Meeting' : 'মিটিং বুক করুন')}
               </Button>
             </form>
           </CardContent>
         </Card>
       </TabsContent>
     </Tabs>
   );
 };
 
 export default ContactFormTabs;