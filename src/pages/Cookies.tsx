import LegalPage from './legal/LegalPage';

const Cookies = () => {
  return (
    <LegalPage
      pageSlug="cookies"
      fallbackTitle="Cookie Policy"
      fallbackTitleBn="কুকি নীতি"
      fallbackContent="<p>Cookie policy content is being updated. Please check back later.</p>"
      fallbackContentBn="<p>কুকি নীতি বিষয়বস্তু আপডেট করা হচ্ছে। অনুগ্রহ করে পরে আবার দেখুন।</p>"
    />
  );
};

export default Cookies;
