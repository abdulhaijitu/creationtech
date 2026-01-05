import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    nameEn: 'Rafiq Ahmed',
    nameBn: 'রফিক আহমেদ',
    roleEn: 'CEO, TechBD Solutions',
    roleBn: 'সিইও, টেকবিডি সলিউশনস',
    quoteEn: 'Creation Tech delivered our e-commerce platform on time and within budget. Their team understood our business needs perfectly.',
    quoteBn: 'Creation Tech আমাদের ই-কমার্স প্ল্যাটফর্ম সময়মতো এবং বাজেটের মধ্যে ডেলিভার করেছে। তাদের দল আমাদের ব্যবসার প্রয়োজন পুরোপুরি বুঝতে পেরেছে।',
    company: 'TechBD',
  },
  {
    nameEn: 'Sarah Rahman',
    nameBn: 'সারা রহমান',
    roleEn: 'Founder, GreenLeaf Retail',
    roleBn: 'প্রতিষ্ঠাতা, গ্রীনলিফ রিটেইল',
    quoteEn: 'Professional team with excellent communication. They turned our vision into a beautiful, functional mobile app.',
    quoteBn: 'চমৎকার যোগাযোগ সহ পেশাদার দল। তারা আমাদের ভিশনকে একটি সুন্দর, কার্যকরী মোবাইল অ্যাপে রূপান্তরিত করেছে।',
    company: 'GreenLeaf',
  },
  {
    nameEn: 'Mohammad Hassan',
    nameBn: 'মোহাম্মদ হাসান',
    roleEn: 'CTO, FinServe Bank',
    roleBn: 'সিটিও, ফিনসার্ভ ব্যাংক',
    quoteEn: 'Their cybersecurity audit saved us from potential threats. Highly recommend their security services.',
    quoteBn: 'তাদের সাইবার সিকিউরিটি অডিট আমাদের সম্ভাব্য হুমকি থেকে রক্ষা করেছে। তাদের নিরাপত্তা সেবা অত্যন্ত সুপারিশ করি।',
    company: 'FinServe',
  },
];

const TestimonialsSection = () => {
  const { language } = useLanguage();

  return (
    <section className="section-padding bg-section-light">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {language === 'en' ? 'What Our Clients Say' : 'আমাদের ক্লায়েন্টরা কী বলেন'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === 'en'
              ? 'Trusted by businesses across industries'
              : 'বিভিন্ন শিল্পের ব্যবসায়ীদের বিশ্বস্ত অংশীদার'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <Quote className="mb-4 h-8 w-8 text-primary/30" />
                <blockquote className="mb-6 text-muted-foreground">
                  "{language === 'en' ? testimonial.quoteEn : testimonial.quoteBn}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {testimonial.company.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {language === 'en' ? testimonial.nameEn : testimonial.nameBn}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? testimonial.roleEn : testimonial.roleBn}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
