import LegalPage from './legal/LegalPage';

const Terms = () => {
  return (
    <LegalPage
      pageSlug="terms"
      fallbackTitle="Terms & Conditions"
      fallbackTitleBn="শর্তাবলী"
      fallbackContent="<p>Terms and conditions content is being updated. Please check back later.</p>"
      fallbackContentBn="<p>শর্তাবলী বিষয়বস্তু আপডেট করা হচ্ছে। অনুগ্রহ করে পরে আবার দেখুন।</p>"
    />
  );
};

export default Terms;
