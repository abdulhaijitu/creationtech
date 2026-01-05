import LegalPage from './legal/LegalPage';

const Privacy = () => {
  return (
    <LegalPage
      pageSlug="privacy"
      fallbackTitle="Privacy Policy"
      fallbackTitleBn="গোপনীয়তা নীতি"
      fallbackContent="<p>Privacy policy content is being updated. Please check back later.</p>"
      fallbackContentBn="<p>গোপনীয়তা নীতি বিষয়বস্তু আপডেট করা হচ্ছে। অনুগ্রহ করে পরে আবার দেখুন।</p>"
    />
  );
};

export default Privacy;
