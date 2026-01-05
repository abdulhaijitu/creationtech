import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, FileText, Calendar } from 'lucide-react';
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

const services = [
  { value: 'web', labelEn: 'Web Development', labelBn: 'ওয়েব ডেভেলপমেন্ট' },
  { value: 'mobile', labelEn: 'Mobile Apps', labelBn: 'মোবাইল অ্যাপস' },
  { value: 'cloud', labelEn: 'Cloud Solutions', labelBn: 'ক্লাউড সলিউশন' },
  { value: 'security', labelEn: 'Cybersecurity', labelBn: 'সাইবার সিকিউরিটি' },
  { value: 'consulting', labelEn: 'IT Consulting', labelBn: 'আইটি পরামর্শ' },
  { value: 'analytics', labelEn: 'Data Analytics', labelBn: 'ডেটা অ্যানালিটিক্স' },
  { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' },
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

  const getMapEmbed = () => {
    const info = businessInfo['map_embed'];
    return info?.value_en || null;
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
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/5 via-transparent to-transparent" />
          <div className="container-custom relative text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Mail className="h-4 w-4" />
              {language === 'en' ? 'Get in Touch' : 'যোগাযোগ করুন'}
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              {t('contact.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-8 text-2xl font-bold tracking-tight">
                    {language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
                  </h2>
                  <div className="space-y-6">
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {language === 'en' ? 'Office Address' : 'অফিসের ঠিকানা'}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {getInfo('address', 'House # 71, Road # 27, Gulshan-01, Dhaka', 'বাসা # ৭১, রোড # ২৭, গুলশান-০১, ঢাকা')}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {language === 'en' ? 'Phone' : 'ফোন'}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {getInfo('phone_primary', '+880 1777656517')}<br />
                          {getInfo('phone_secondary', '+880 2-9123456')}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {language === 'en' ? 'Email' : 'ইমেইল'}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {getInfo('email_primary', 'info@creationtech.com')}<br />
                          {getInfo('email_support', 'support@creationtech.com')}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়'}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {getInfo('business_hours', 'Sun - Thu: 9:00 AM - 6:00 PM', 'রবি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted shadow-card">
                  {getMapEmbed() ? (
                    <div 
                      className="h-full w-full"
                      dangerouslySetInnerHTML={{ 
                        __html: getMapEmbed()!.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"')
                      }} 
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <MapPin className="mr-2 h-5 w-5" />
                      {language === 'en' ? 'Map Loading...' : 'ম্যাপ লোড হচ্ছে...'}
                    </div>
                  )}
                </div>
              </div>

              {/* Forms */}
              <div className="lg:col-span-2">
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="mb-8 grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1.5">
                    <TabsTrigger 
                      value="contact" 
                      className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quote" 
                      className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Quote' : 'কোটেশন'}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="meeting" 
                      className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Meeting' : 'মিটিং'}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Contact Form */}
                  <TabsContent value="contact" className="mt-0">
                    <Card className="border-border/40 shadow-card">
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
                              <Label htmlFor="contact-name" className="text-sm font-medium">{t('contact.form.name')} *</Label>
                              <Input 
                                id="contact-name" 
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact-email" className="text-sm font-medium">{t('contact.form.email')} *</Label>
                              <Input 
                                id="contact-email" 
                                type="email" 
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-phone" className="text-sm font-medium">{t('contact.form.phone')}</Label>
                            <Input 
                              id="contact-phone" 
                              type="tel" 
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              placeholder={language === 'en' ? '+880 1XXX-XXXXXX' : '+880 1XXX-XXXXXX'}
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-message" className="text-sm font-medium">{t('contact.form.message')} *</Label>
                            <Textarea 
                              id="contact-message" 
                              rows={4} 
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              placeholder={language === 'en' ? 'Tell us more about your inquiry...' : 'আপনার প্রশ্ন সম্পর্কে বিস্তারিত বলুন...'}
                              required 
                            />
                          </div>
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            <Send className="h-4 w-4" />
                            {isSubmitting 
                              ? (language === 'en' ? 'Sending...' : 'পাঠানো হচ্ছে...') 
                              : t('common.send')}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Quote Form */}
                  <TabsContent value="quote" className="mt-0">
                    <Card className="border-border/40 shadow-card">
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
                              <Label htmlFor="quote-name" className="text-sm font-medium">{t('contact.form.name')} *</Label>
                              <Input 
                                id="quote-name" 
                                value={quoteForm.name}
                                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-email" className="text-sm font-medium">{t('contact.form.email')} *</Label>
                              <Input 
                                id="quote-email" 
                                type="email" 
                                value={quoteForm.email}
                                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                required 
                              />
                            </div>
                          </div>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="quote-phone" className="text-sm font-medium">{t('contact.form.phone')}</Label>
                              <Input 
                                id="quote-phone" 
                                type="tel" 
                                value={quoteForm.phone}
                                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                placeholder={language === 'en' ? '+880 1XXX-XXXXXX' : '+880 1XXX-XXXXXX'}
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
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quote-service" className="text-sm font-medium">{t('contact.form.service')} *</Label>
                            <select
                              id="quote-service"
                              className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-base ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quote-details" className="text-sm font-medium">
                              {language === 'en' ? 'Project Details' : 'প্রকল্পের বিবরণ'} *
                            </Label>
                            <Textarea 
                              id="quote-details" 
                              rows={4} 
                              value={quoteForm.details}
                              onChange={(e) => setQuoteForm({ ...quoteForm, details: e.target.value })}
                              placeholder={language === 'en' ? 'Describe your project requirements...' : 'আপনার প্রকল্পের প্রয়োজনীয়তা বর্ণনা করুন...'}
                              required 
                            />
                          </div>
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            <FileText className="h-4 w-4" />
                            {isSubmitting 
                              ? (language === 'en' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...') 
                              : t('common.getQuote')}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Meeting Form */}
                  <TabsContent value="meeting" className="mt-0">
                    <Card className="border-border/40 shadow-card">
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
                              <Label htmlFor="meeting-name" className="text-sm font-medium">{t('contact.form.name')} *</Label>
                              <Input 
                                id="meeting-name" 
                                value={meetingForm.name}
                                onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                                placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-email" className="text-sm font-medium">{t('contact.form.email')} *</Label>
                              <Input 
                                id="meeting-email" 
                                type="email" 
                                value={meetingForm.email}
                                onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                                placeholder={language === 'en' ? 'john@example.com' : 'example@email.com'}
                                required 
                              />
                            </div>
                          </div>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="meeting-phone" className="text-sm font-medium">{t('contact.form.phone')} *</Label>
                              <Input 
                                id="meeting-phone" 
                                type="tel" 
                                value={meetingForm.phone}
                                onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                                placeholder={language === 'en' ? '+880 1XXX-XXXXXX' : '+880 1XXX-XXXXXX'}
                                required 
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
                            />
                          </div>
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
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
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
