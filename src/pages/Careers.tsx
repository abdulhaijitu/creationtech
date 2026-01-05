import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Briefcase, Users, Heart, Coffee } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const jobOpenings = [
  {
    id: '1',
    titleEn: 'Senior React Developer',
    titleBn: 'সিনিয়র রিঅ্যাক্ট ডেভেলপার',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Dhaka, Bangladesh',
    descEn: 'We are looking for an experienced React developer to join our frontend team and build amazing user interfaces.',
    descBn: 'আমরা একজন অভিজ্ঞ React ডেভেলপার খুঁজছি আমাদের ফ্রন্টএন্ড টিমে যোগ দিতে।',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'State management expertise'],
  },
  {
    id: '2',
    titleEn: 'Backend Engineer (Node.js)',
    titleBn: 'ব্যাকএন্ড ইঞ্জিনিয়ার (Node.js)',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Dhaka, Bangladesh',
    descEn: 'Join our backend team to design and implement scalable APIs and microservices.',
    descBn: 'স্কেলেবল API এবং মাইক্রোসার্ভিস ডিজাইন এবং বাস্তবায়ন করতে আমাদের ব্যাকএন্ড টিমে যোগ দিন।',
    requirements: ['3+ years Node.js', 'PostgreSQL/MongoDB', 'REST/GraphQL APIs'],
  },
  {
    id: '3',
    titleEn: 'UI/UX Designer',
    titleBn: 'UI/UX ডিজাইনার',
    department: 'Design',
    type: 'Full-time',
    location: 'Dhaka / Remote',
    descEn: 'Create beautiful and intuitive user experiences for web and mobile applications.',
    descBn: 'ওয়েব এবং মোবাইল অ্যাপ্লিকেশনের জন্য সুন্দর এবং স্বজ্ঞাত ব্যবহারকারী অভিজ্ঞতা তৈরি করুন।',
    requirements: ['Figma expertise', 'User research skills', 'Design systems knowledge'],
  },
  {
    id: '4',
    titleEn: 'DevOps Engineer',
    titleBn: 'DevOps ইঞ্জিনিয়ার',
    department: 'Infrastructure',
    type: 'Full-time',
    location: 'Dhaka, Bangladesh',
    descEn: 'Manage cloud infrastructure, CI/CD pipelines, and ensure system reliability.',
    descBn: 'ক্লাউড ইনফ্রাস্ট্রাকচার, CI/CD পাইপলাইন পরিচালনা করুন এবং সিস্টেম নির্ভরযোগ্যতা নিশ্চিত করুন।',
    requirements: ['AWS/GCP experience', 'Docker/Kubernetes', 'Terraform/Ansible'],
  },
];

const benefits = [
  { icon: Heart, titleEn: 'Health Insurance', titleBn: 'স্বাস্থ্য বীমা', descEn: 'Comprehensive health coverage for you and family', descBn: 'আপনার এবং পরিবারের জন্য ব্যাপক স্বাস্থ্য কভারেজ' },
  { icon: Users, titleEn: 'Flexible Work', titleBn: 'নমনীয় কাজ', descEn: 'Remote and hybrid work options available', descBn: 'রিমোট এবং হাইব্রিড কাজের বিকল্প উপলব্ধ' },
  { icon: Coffee, titleEn: 'Learning Budget', titleBn: 'শেখার বাজেট', descEn: 'Annual budget for courses and conferences', descBn: 'কোর্স এবং কনফারেন্সের জন্য বার্ষিক বাজেট' },
  { icon: Briefcase, titleEn: 'Career Growth', titleBn: 'ক্যারিয়ার বৃদ্ধি', descEn: 'Clear career paths and mentorship programs', descBn: 'স্পষ্ট ক্যারিয়ার পথ এবং মেন্টরশিপ প্রোগ্রাম' },
];

const Careers = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resumeUrl: '',
    coverLetter: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        position: formData.position,
        resume_url: formData.resumeUrl || null,
        cover_letter: formData.coverLetter || null,
      });
      if (error) throw error;
      toast({
        title: language === 'en' ? 'Application Submitted!' : 'আবেদন জমা হয়েছে!',
        description: language === 'en'
          ? 'Thank you for applying. We will review your application and get back to you soon.'
          : 'আবেদন করার জন্য ধন্যবাদ। আমরা আপনার আবেদন পর্যালোচনা করব এবং শীঘ্রই যোগাযোগ করব।',
      });
      setFormData({ name: '', email: '', phone: '', position: '', resumeUrl: '', coverLetter: '' });
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: language === 'en' ? 'Failed to submit application. Please try again.' : 'আবেদন জমা দিতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers - Creation Tech | Join Our Team</title>
        <meta
          name="description"
          content="Join Creation Tech's team of talented professionals. Explore current job openings and start your career with us."
        />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="gradient-hero py-20 lg:py-28">
          <div className="container-custom text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              {t('careers.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              {t('careers.subtitle')}
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {language === 'en' ? 'Why Work With Us?' : 'কেন আমাদের সাথে কাজ করবেন?'}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-2 font-semibold">
                        {language === 'en' ? benefit.titleEn : benefit.titleBn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'en' ? benefit.descEn : benefit.descBn}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {language === 'en' ? 'Open Positions' : 'খোলা পদ'}
            </h2>
            <div className="mx-auto max-w-4xl space-y-6">
              {jobOpenings.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">
                          {language === 'en' ? job.titleEn : job.titleBn}
                        </CardTitle>
                        <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <a href="#apply">{t('common.apply')}</a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      {language === 'en' ? job.descEn : job.descBn}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <Badge key={i} variant="secondary">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="section-padding" id="apply">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center text-3xl font-bold">
                {language === 'en' ? 'Apply Now' : 'এখনই আবেদন করুন'}
              </h2>
              <p className="mb-8 text-center text-muted-foreground">
                {language === 'en'
                  ? "Don't see a perfect match? Send us your resume anyway!"
                  : 'নিখুঁত মিল দেখতে পাচ্ছেন না? তবুও আমাদের আপনার জীবনবৃত্তান্ত পাঠান!'}
              </p>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.form.name')} *</Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.form.email')} *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">
                        {language === 'en' ? 'Position Applied For' : 'আবেদনকৃত পদ'} *
                      </Label>
                      <Input 
                        id="position" 
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl">
                        {language === 'en' ? 'Resume/CV Link' : 'জীবনবৃত্তান্ত লিংক'}
                      </Label>
                      <Input 
                        id="resumeUrl" 
                        type="url" 
                        placeholder={language === 'en' ? 'Google Drive, Dropbox, or LinkedIn URL' : 'Google Drive, Dropbox, বা LinkedIn URL'}
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Share a link to your resume from Google Drive, Dropbox, or LinkedIn' : 'Google Drive, Dropbox, বা LinkedIn থেকে আপনার জীবনবৃত্তান্তের লিংক শেয়ার করুন'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cover">
                        {language === 'en' ? 'Cover Letter' : 'কভার লেটার'}
                      </Label>
                      <Textarea 
                        id="cover" 
                        rows={4} 
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting 
                        ? (language === 'en' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...') 
                        : t('common.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Careers;
