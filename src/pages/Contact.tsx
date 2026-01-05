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

  const handleSubmit = (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    toast({
      title: language === 'en' ? 'Message Sent!' : 'বার্তা পাঠানো হয়েছে!',
      description: language === 'en'
        ? 'Thank you for reaching out. We will get back to you soon.'
        : 'যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
    });
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
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('contact.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('contact.subtitle')}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-6 text-2xl font-bold">
                    {language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === 'en' ? 'Office Address' : 'অফিসের ঠিকানা'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          123 Tech Street, Gulshan-2<br />
                          Dhaka 1212, Bangladesh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === 'en' ? 'Phone' : 'ফোন'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          +880 1XXX-XXXXXX<br />
                          +880 2-XXXXXXXX
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === 'en' ? 'Email' : 'ইমেইল'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          info@creationtech.com<br />
                          support@creationtech.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {language === 'en' ? 'Business Hours' : 'ব্যবসায়িক সময়'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en'
                            ? 'Sun - Thu: 9:00 AM - 6:00 PM'
                            : 'রবি - বৃহস্পতি: সকাল ৯:০০ - সন্ধ্যা ৬:০০'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <MapPin className="mr-2 h-5 w-5" />
                    {language === 'en' ? 'Map Coming Soon' : 'শীঘ্রই ম্যাপ আসছে'}
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div className="lg:col-span-2">
                <Tabs defaultValue={defaultTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="contact" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="quote" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Quote' : 'কোটেশন'}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="meeting" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {language === 'en' ? 'Meeting' : 'মিটিং'}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Contact Form */}
                  <TabsContent value="contact">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en'
                            ? "Have a question? We'd love to hear from you."
                            : 'প্রশ্ন আছে? আমরা আপনার কাছ থেকে শুনতে চাই।'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => handleSubmit(e, 'contact')} className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="contact-name">{t('contact.form.name')} *</Label>
                              <Input id="contact-name" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="contact-email">{t('contact.form.email')} *</Label>
                              <Input id="contact-email" type="email" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-phone">{t('contact.form.phone')}</Label>
                            <Input id="contact-phone" type="tel" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-subject">
                              {language === 'en' ? 'Subject' : 'বিষয়'} *
                            </Label>
                            <Input id="contact-subject" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-message">{t('contact.form.message')} *</Label>
                            <Textarea id="contact-message" rows={4} required />
                          </div>
                          <Button type="submit" className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            {t('common.send')}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Quote Form */}
                  <TabsContent value="quote">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === 'en' ? 'Request a Quote' : 'কোটেশনের অনুরোধ'}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en'
                            ? 'Tell us about your project and we will provide a detailed quote.'
                            : 'আপনার প্রকল্প সম্পর্কে বলুন এবং আমরা একটি বিস্তারিত কোটেশন প্রদান করব।'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => handleSubmit(e, 'quote')} className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="quote-name">{t('contact.form.name')} *</Label>
                              <Input id="quote-name" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-email">{t('contact.form.email')} *</Label>
                              <Input id="quote-email" type="email" required />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="quote-phone">{t('contact.form.phone')}</Label>
                              <Input id="quote-phone" type="tel" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="quote-company">
                                {language === 'en' ? 'Company' : 'কোম্পানি'}
                              </Label>
                              <Input id="quote-company" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quote-service">{t('contact.form.service')} *</Label>
                            <select
                              id="quote-service"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                            <Label htmlFor="quote-budget">
                              {language === 'en' ? 'Estimated Budget' : 'আনুমানিক বাজেট'}
                            </Label>
                            <Input id="quote-budget" placeholder={language === 'en' ? 'e.g., $5,000 - $10,000' : 'যেমন, ৫০,০০০ - ১,০০,০০০ টাকা'} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quote-details">
                              {language === 'en' ? 'Project Details' : 'প্রকল্পের বিবরণ'} *
                            </Label>
                            <Textarea id="quote-details" rows={4} required />
                          </div>
                          <Button type="submit" className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            {t('common.getQuote')}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Meeting Form */}
                  <TabsContent value="meeting">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {language === 'en' ? 'Book a Meeting' : 'মিটিং বুক করুন'}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en'
                            ? 'Schedule a consultation with our team.'
                            : 'আমাদের দলের সাথে একটি পরামর্শ সিডিউল করুন।'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => handleSubmit(e, 'meeting')} className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="meeting-name">{t('contact.form.name')} *</Label>
                              <Input id="meeting-name" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-email">{t('contact.form.email')} *</Label>
                              <Input id="meeting-email" type="email" required />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="meeting-phone">{t('contact.form.phone')} *</Label>
                              <Input id="meeting-phone" type="tel" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-company">
                                {language === 'en' ? 'Company' : 'কোম্পানি'}
                              </Label>
                              <Input id="meeting-company" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="meeting-date">
                                {language === 'en' ? 'Preferred Date' : 'পছন্দের তারিখ'} *
                              </Label>
                              <Input id="meeting-date" type="date" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="meeting-time">
                                {language === 'en' ? 'Preferred Time' : 'পছন্দের সময়'} *
                              </Label>
                              <Input id="meeting-time" type="time" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="meeting-topic">
                              {language === 'en' ? 'Meeting Topic' : 'মিটিংয়ের বিষয়'} *
                            </Label>
                            <Input id="meeting-topic" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="meeting-notes">
                              {language === 'en' ? 'Additional Notes' : 'অতিরিক্ত নোট'}
                            </Label>
                            <Textarea id="meeting-notes" rows={3} />
                          </div>
                          <Button type="submit" className="w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            {t('common.bookMeeting')}
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
