import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Briefcase, Users, Heart, Coffee, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
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
        <title>Software Developer Jobs in Bangladesh | Careers at Creation Tech</title>
        <meta
          name="description"
          content="Join Bangladesh's leading software company. Explore software developer jobs, UI/UX designer positions, and DevOps engineer careers at Creation Tech."
        />
        <meta name="keywords" content="software developer jobs Bangladesh, IT jobs Dhaka, React developer jobs, DevOps engineer careers" />
        <link rel="canonical" href="https://creationtechbd.com/careers" />
      </Helmet>
      <Layout>
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero section-padding">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container-custom relative">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 bg-white/10 text-primary-foreground border-white/20 backdrop-blur-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {language === 'en' ? "We're Hiring!" : 'আমরা নিয়োগ করছি!'}
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                {language === 'en' ? 'Software Developer Jobs in Bangladesh' : 'বাংলাদেশে সফটওয়্যার ডেভেলপার চাকরি'}
              </h1>
              
              <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
                {t('careers.subtitle')}
              </p>
              
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <a href="#positions">
                  {language === 'en' ? 'View Open Positions' : 'খোলা পদ দেখুন'}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-section-light">
          <div className="container-custom">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'en' ? 'Why Work With Us?' : 'কেন আমাদের সাথে কাজ করবেন?'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'en' 
                  ? 'Join a team that values growth, innovation, and work-life balance'
                  : 'এমন একটি দলে যোগ দিন যা বৃদ্ধি, উদ্ভাবন এবং কর্ম-জীবনের ভারসাম্যকে মূল্য দেয়'}
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card 
                    key={index} 
                    className="group text-center border-border/40 transition-all duration-250 hover:border-border/60 hover:shadow-card-hover"
                  >
                    <CardContent className="p-7">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 text-primary transition-transform duration-250 group-hover:scale-110">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        {language === 'en' ? benefit.titleEn : benefit.titleBn}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {language === 'en' ? benefit.descEn : benefit.descBn}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className="section-padding" id="positions">
          <div className="container-custom">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {language === 'en' ? 'Open Positions' : 'খোলা পদ'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'en' 
                  ? 'Find your next opportunity and grow with us'
                  : 'আপনার পরবর্তী সুযোগ খুঁজুন এবং আমাদের সাথে বেড়ে উঠুন'}
              </p>
            </div>
            
            <div className="mx-auto max-w-4xl space-y-5">
              {jobOpenings.map((job, index) => (
                <Card 
                  key={job.id} 
                  className="group overflow-hidden border-border/40 transition-all duration-250 hover:border-border/60 hover:shadow-card-hover"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-xl font-bold group-hover:text-primary transition-colors duration-200">
                          {language === 'en' ? job.titleEn : job.titleBn}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4 text-muted-foreground/70" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground/70" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-muted-foreground/70" />
                            {job.location}
                          </span>
                        </CardDescription>
                      </div>
                      <Button asChild className="shrink-0">
                        <a href="#apply">
                          {t('common.apply')}
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                      {language === 'en' ? job.descEn : job.descBn}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary"
                          className="bg-secondary/80 text-secondary-foreground/80"
                        >
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

        {/* Application Form Section */}
        <section className="section-padding bg-section-alt" id="apply">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {language === 'en' ? 'Apply Now' : 'এখনই আবেদন করুন'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {language === 'en'
                    ? "Don't see a perfect match? Send us your resume anyway!"
                    : 'নিখুঁত মিল দেখতে পাচ্ছেন না? তবুও আমাদের আপনার জীবনবৃত্তান্ত পাঠান!'}
                </p>
              </div>
              
              <Card className="border-border/40 shadow-card">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          {t('contact.form.name')} <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required 
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t('contact.form.email')} <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required 
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {t('contact.form.phone')}
                        </Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-sm font-medium">
                          {language === 'en' ? 'Position Applied For' : 'আবেদনকৃত পদ'} <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="position" 
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          required 
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl" className="text-sm font-medium">
                        {language === 'en' ? 'Resume/CV Link' : 'জীবনবৃত্তান্ত লিংক'}
                      </Label>
                      <Input 
                        id="resumeUrl" 
                        type="url" 
                        placeholder={language === 'en' ? 'Google Drive, Dropbox, or LinkedIn URL' : 'Google Drive, Dropbox, বা LinkedIn URL'}
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Share a link to your resume from Google Drive, Dropbox, or LinkedIn' : 'Google Drive, Dropbox, বা LinkedIn থেকে আপনার জীবনবৃত্তান্তের লিংক শেয়ার করুন'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cover" className="text-sm font-medium">
                        {language === 'en' ? 'Cover Letter' : 'কভার লেটার'}
                      </Label>
                      <Textarea 
                        id="cover" 
                        rows={5} 
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        placeholder={language === 'en' ? 'Tell us why you would be a great fit...' : 'আমাদের বলুন কেন আপনি একটি দুর্দান্ত ফিট হবেন...'}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? (language === 'en' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...') 
                        : t('common.submit')}
                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden gradient-hero section-padding-sm">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container-custom relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                {language === 'en' ? 'Have Questions?' : 'প্রশ্ন আছে?'}
              </h2>
              <p className="mb-6 text-primary-foreground/80">
                {language === 'en' 
                  ? "Reach out to our HR team. We'd love to hear from you!"
                  : 'আমাদের HR টিমের সাথে যোগাযোগ করুন। আমরা আপনার কাছ থেকে শুনতে চাই!'}
              </p>
              <Button 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <a href="mailto:careers@creationtech.com">
                  careers@creationtech.com
                </a>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Careers;
