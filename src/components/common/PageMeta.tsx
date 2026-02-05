 import { Helmet } from 'react-helmet-async';
 
 interface PageMetaProps {
   title: string;
   description: string;
   path?: string;
   image?: string;
   type?: 'website' | 'article';
   noIndex?: boolean;
 }
 
 /**
  * Centralized SEO meta tags component
  * Handles Open Graph, Twitter Cards, and standard meta tags
  */
 const PageMeta = ({
   title,
   description,
   path = '',
   image = '/og-image.png',
   type = 'website',
   noIndex = false,
 }: PageMetaProps) => {
   const siteUrl = 'https://creationtechbd.com';
   const fullUrl = `${siteUrl}${path}`;
   const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
   const siteName = 'Creation Tech';
 
   return (
     <Helmet>
       {/* Primary Meta Tags */}
       <title>{title}</title>
       <meta name="title" content={title} />
       <meta name="description" content={description} />
       {noIndex && <meta name="robots" content="noindex, nofollow" />}
       <link rel="canonical" href={fullUrl} />
 
       {/* Open Graph / Facebook */}
       <meta property="og:type" content={type} />
       <meta property="og:url" content={fullUrl} />
       <meta property="og:title" content={title} />
       <meta property="og:description" content={description} />
       <meta property="og:image" content={fullImageUrl} />
       <meta property="og:image:width" content="1200" />
       <meta property="og:image:height" content="630" />
       <meta property="og:site_name" content={siteName} />
       <meta property="og:locale" content="en_US" />
       <meta property="og:locale:alternate" content="bn_BD" />
 
       {/* Twitter */}
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:url" content={fullUrl} />
       <meta name="twitter:title" content={title} />
       <meta name="twitter:description" content={description} />
       <meta name="twitter:image" content={fullImageUrl} />
     </Helmet>
   );
 };
 
 export default PageMeta;