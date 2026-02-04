import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, FileText, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useBusinessInfoMap } from '@/hooks/useBusinessInfo';
import { supabase } from '@/integrations/supabase/client';
import ScrollReveal from '@/components/common/ScrollReveal';

const services = [
  { value: 'web', labelEn: 'Web Development', labelBn: 'ওয়েব ডেভেলপমেন্ট' },
  { value: 'mobile', labelEn: 'Mobile Apps', labelBn: 'মোবাইল অ্যাপস' },
  { value: 'cloud', labelEn: 'Cloud Solutions', labelBn: 'ক্লাউড সলিউশন' },
  { value: 'security', labelEn: 'Cybersecurity', labelBn: 'সাইবার সিকিউরিটি' },
  { value: 'consulting', labelEn: 'IT Consulting', labelBn: 'আইটি পরামর্শ' },
  { value: 'analytics', labelEn: 'Data Analytics', labelBn: 'ডেটা অ্যানালিটিক্স' },
  { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
];

const contactFeatures = [
  { icon: CheckCircle2, labelEn: 'Free Consultation', labelBn: 'বিনামূল্যে পরামর্শ' },
  { icon: CheckCircle2, labelEn: '24h Response Time', labelBn: '২৪ ঘন্টায় উত্তর' },
  { icon: CheckCircle2, labelEn: 'Expert Team', labelBn: 'বিশেষজ্ঞ দল' },
];

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('type') || 'contact';
  const { data: businessInfo } = useBusinessInfoMap();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', details: '' });
  const [meetingForm, setMeetingForm] = useState({ name: '', email: '', phone: '', company: '', date: '', time: '', topic: '', notes: '' });

  const getInfo = (key: string, fallbackEn: string, fallbackBn?: string) => {
    const info = businessInfo[key];
    if (info) {
      return language === 'en' ? (info.value_en || fallbackEn) : (info.value_bn || fallbackBn || fallbackEn);
    }
    return language === 'en' ? fallbackEn : (fallbackBn || fallbackEn);
  };

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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: language === 'en' ? 'Failed to book meeting. Please try again.' : 'মিটিং বুক করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Creation Tech | Get in Touch</title>
        <meta
          name="description"
          content="Contact Creation Tech for IT solutions, quotes, or to schedule a meeting. We're here to help with your technology needs."
        />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0a1628] py-20 lg:py-28">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 30% 40%, rgba(20, 184, 166, 0.12) 0%, transparent 60%),
                            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(6, 78, 59, 0.15) 0%, transparent 50%)`
              }}
            />
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <div className="container-custom relative">
            <div className="mx-auto max-w-3xl text-center">
              <ScrollReveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-400 backdrop-blur-sm">
                  <Mail className="h-4 w-4" />
                  {language === 'en' ? 'Get in Touch' : 'যোগাযোগ করুন'}
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {language === 'en' ? "Let's Build Something Great Together" : 'আসুন একসাথে দুর্দান্ত কিছু তৈরি করি'}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="mb-8 text-lg text-white/60 leading-relaxed">
                  {language === 'en' 
                    ? 'Ready to transform your business with cutting-edge technology? Our team is here to help you every step of the way.'
                    : 'আধুনিক প্রযুক্তি দিয়ে আপনার ব্যবসা রূপান্তর করতে প্রস্তুত? আমাদের দল প্রতিটি পদক্ষেপে আপনাকে সাহায্য করতে এখানে।'}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {contactFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-white/70">
                      <feature.icon className="h-4 w-4 text-teal-400" />
                      <span>{language === 'en' ? feature.labelEn : feature.labelBn}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-5">
              {/* Left Column - Contact Info & Map */}
              <div className="lg:col-span-2 space-y-8">
                <ScrollReveal>
                  <div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight">
                      {language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === 'en' ? 'Reach out to us through any of these channels.' : 'এই মাধ্যমগুলোর মাধ্যমে আমাদের সাথে যোগাযোগ করুন।'}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Contact Cards */}
                <div className="space-y-4">
                  <ScrollReveal delay={0.1}>
                    <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {language === 'en' ? 'Office Address' : 'অফিসের ঠিকানা'}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getInfo('address', 'House # 71, Road # 27, Gulshan-01, Dhaka', 'বাসা # ৭১, রোড # ২৭, গুলশান-০১, ঢাকা')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.15}>
                    <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {language === 'en' ? 'Phone' : 'ফোন'}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            <a href="tel:+8801833876434" className="hover:text-primary transition-colors">01833876434</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.2}>
                    <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {language === 'en' ? 'Email' : 'ইমেইল'}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            <a href="mailto:info@creationtechbd.com" className="hover:text-primary transition-colors">info@creationtechbd.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.25}>
                    <div className="group rounded-xl border border-border/60 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়'}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {getInfo('business_hours', 'Sun - Thu: 9:00 AM - 6:00 PM', 'রবি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Map */}
                <ScrollReveal delay={0.3}>
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-muted shadow-card">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0744892088814!2d90.41280187536068!3d23.782292178663987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70dbd93%3A0x4c9e62d2f50a9a91!2sGulshan-1%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1704067200000!5m2!1sen!2sbd"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="CreationTech Office Location"
                      className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column - Forms */}
              <div className="lg:col-span-3">
                <ScrollReveal delay={0.1}>
                  <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="mb-8 grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1.5 h-auto">
                      <TabsTrigger 
                        value="contact" 
                        className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="quote" 
                        className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {language === 'en' ? 'Quote' : 'কোটেশন'}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="meeting" 
                        className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {language === 'en' ? 'Meeting' : 'মিটিং'}
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Contact Form */}
                    <TabsContent value="contact" className="mt-0">
                      <Card className="border-border/40 shadow-lg">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold">
                            {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {language === 'en'
                              ? "Have a question? We'd love to hear from you."
                              : 'প্রশ্ন আছে? আমরা আপনার কাছ থেকে শুনতে চাই।'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleContactSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="contact-name" className="text-sm font-medium">
                                  {language === 'en' ? 'Full Name' : 'পুরো নাম'} *
                                </Label>
                                <Input 
                                  id="contact-name" 
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                  placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contact-email" className="text-sm font-medium">
                                  {language === 'en' ? 'Email' : 'ইমেইল'} *
                                </Label>
                                <Input 
                                  id="contact-email" 
                                  type="email" 
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="contact-phone" className="text-sm font-medium">
                                  {language === 'en' ? 'Phone' : 'ফোন'}
                                </Label>
                                <Input 
                                  id="contact-phone" 
                                  type="tel" 
                                  value={contactForm.phone}
                                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                  placeholder="+880 1XXX-XXXXXX"
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contact-subject" className="text-sm font-medium">
                                  {language === 'en' ? 'Subject' : 'বিষয়'} *
                                </Label>
                                <Input 
                                  id="contact-subject" 
                                  value={contactForm.subject}
                                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                  placeholder={language === 'en' ? 'How can we help?' : 'আমরা কিভাবে সাহায্য করতে পারি?'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact-message" className="text-sm font-medium">
                                {language === 'en' ? 'Message' : 'বার্তা'} *
                              </Label>
                              <Textarea 
                                id="contact-message" 
                                rows={5} 
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                placeholder={language === 'en' ? 'Tell us more about your inquiry...' : 'আপনার প্রশ্ন সম্পর্কে বিস্তারিত বলুন...'}
                                required 
                                className="resize-none"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="w-full h-12 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200" 
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
                      <Card className="border-border/40 shadow-lg">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold">
                            {language === 'en' ? 'Request a Quote' : 'কোটেশনের অনুরোধ'}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {language === 'en'
                              ? 'Tell us about your project and we will provide a detailed quote.'
                              : 'আপনার প্রকল্প সম্পর্কে বলুন এবং আমরা একটি বিস্তারিত কোটেশন প্রদান করব।'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleQuoteSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="quote-name" className="text-sm font-medium">
                                  {language === 'en' ? 'Full Name' : 'পুরো নাম'} *
                                </Label>
                                <Input 
                                  id="quote-name" 
                                  value={quoteForm.name}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                  placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quote-email" className="text-sm font-medium">
                                  {language === 'en' ? 'Email' : 'ইমেইল'} *
                                </Label>
                                <Input 
                                  id="quote-email" 
                                  type="email" 
                                  value={quoteForm.email}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                  placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="quote-phone" className="text-sm font-medium">
                                  {language === 'en' ? 'Phone' : 'ফোন'}
                                </Label>
                                <Input 
                                  id="quote-phone" 
                                  type="tel" 
                                  value={quoteForm.phone}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                  placeholder="+880 1XXX-XXXXXX"
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quote-company" className="text-sm font-medium">
                                  {language === 'en' ? 'Company' : 'কোম্পানি'}
                                </Label>
                                <Input 
                                  id="quote-company" 
                                  value={quoteForm.company}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                                  placeholder={language === 'en' ? 'Your Company' : 'আপনার কোম্পানি'}
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="quote-service" className="text-sm font-medium">
                                  {language === 'en' ? 'Service Interest' : 'সেবা'} *
                                </Label>
                                <select
                                  id="quote-service"
                                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="quote-budget" className="text-sm font-medium">
                                  {language === 'en' ? 'Estimated Budget' : 'আনুমানিক বাজেট'}
                                </Label>
                                <Input 
                                  id="quote-budget" 
                                  placeholder={language === 'en' ? 'e.g., $5,000 - $10,000' : 'যেমন, ৫০,০০০ - ১,০০,০০০ টাকা'} 
                                  value={quoteForm.budget}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-details" className="text-sm font-medium">
                                {language === 'en' ? 'Project Details' : 'প্রকল্পের বিবরণ'} *
                              </Label>
                              <Textarea 
                                id="quote-details" 
                                rows={5} 
                                value={quoteForm.details}
                                onChange={(e) => setQuoteForm({ ...quoteForm, details: e.target.value })}
                                placeholder={language === 'en' ? 'Describe your project requirements...' : 'আপনার প্রকল্পের প্রয়োজনীয়তা বর্ণনা করুন...'}
                                required 
                                className="resize-none"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="w-full h-12 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200" 
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
                      <Card className="border-border/40 shadow-lg">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold">
                            {language === 'en' ? 'Book a Meeting' : 'মিটিং বুক করুন'}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {language === 'en'
                              ? 'Schedule a consultation with our team.'
                              : 'আমাদের দলের সাথে একটি পরামর্শ সিডিউল করুন।'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleMeetingSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="meeting-name" className="text-sm font-medium">
                                  {language === 'en' ? 'Full Name' : 'পুরো নাম'} *
                                </Label>
                                <Input 
                                  id="meeting-name" 
                                  value={meetingForm.name}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                                  placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="meeting-email" className="text-sm font-medium">
                                  {language === 'en' ? 'Email' : 'ইমেইল'} *
                                </Label>
                                <Input 
                                  id="meeting-email" 
                                  type="email" 
                                  value={meetingForm.email}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                                  placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                  required 
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="meeting-phone" className="text-sm font-medium">
                                  {language === 'en' ? 'Phone' : 'ফোন'} *
                                </Label>
                                <Input 
                                  id="meeting-phone" 
                                  type="tel" 
                                  value={meetingForm.phone}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                                  placeholder="+880 1XXX-XXXXXX"
                                  required 
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="meeting-company" className="text-sm font-medium">
                                  {language === 'en' ? 'Company' : 'কোম্পানি'}
                                </Label>
                                <Input 
                                  id="meeting-company" 
                                  value={meetingForm.company}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, company: e.target.value })}
                                  placeholder={language === 'en' ? 'Your Company' : 'আপনার কোম্পানি'}
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="meeting-date" className="text-sm font-medium">
                                  {language === 'en' ? 'Preferred Date' : 'পছন্দের তারিখ'} *
                                </Label>
                                <Input 
                                  id="meeting-date" 
                                  type="date" 
                                  value={meetingForm.date}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                                  required 
                                  className="h-12"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="meeting-time" className="text-sm font-medium">
                                  {language === 'en' ? 'Preferred Time' : 'পছন্দের সময়'} *
                                </Label>
                                <Input 
                                  id="meeting-time" 
                                  type="time" 
                                  value={meetingForm.time}
                                  onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                                  required 
                                  className="h-12"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-topic" className="text-sm font-medium">
                                {language === 'en' ? 'Meeting Topic' : 'মিটিংয়ের বিষয়'} *
                              </Label>
                              <Input 
                                id="meeting-topic" 
                                value={meetingForm.topic}
                                onChange={(e) => setMeetingForm({ ...meetingForm, topic: e.target.value })}
                                placeholder={language === 'en' ? 'What would you like to discuss?' : 'আপনি কি আলোচনা করতে চান?'}
                                required 
                                className="h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-notes" className="text-sm font-medium">
                                {language === 'en' ? 'Additional Notes' : 'অতিরিক্ত নোট'}
                              </Label>
                              <Textarea 
                                id="meeting-notes" 
                                rows={3} 
                                value={meetingForm.notes}
                                onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                                placeholder={language === 'en' ? 'Any additional information...' : 'অতিরিক্ত তথ্য...'}
                                className="resize-none"
                              />
                            </div>
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="w-full h-12 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200" 
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
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
