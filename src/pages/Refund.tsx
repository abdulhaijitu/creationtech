import LegalPage from './legal/LegalPage';

const Refund = () => {
  return (
    <LegalPage
      pageSlug="refund"
      fallbackTitle="Refund & Cancellation Policy"
      fallbackTitleBn="ফেরত এবং বাতিল নীতি"
      fallbackContent="<p>Refund policy content is being updated. Please check back later.</p>"
      fallbackContentBn="<p>ফেরত নীতি বিষয়বস্তু আপডেট করা হচ্ছে। অনুগ্রহ করে পরে আবার দেখুন।</p>"
    />
  );
};

export default Refund;
