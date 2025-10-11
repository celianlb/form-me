import { Metadata } from 'next';

const baseUrl = 'https://form-me.fr';
const siteName = 'Form Me';
const defaultDescription =
  'Form Me - Plateforme de formation professionnelle. Découvrez nos formations certifiantes et qualifiantes adaptées à vos besoins.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'formation professionnelle',
    'formation certifiante',
    'formation qualifiante',
    'développement professionnel',
    'apprentissage',
    'certifications',
  ],
  authors: [{ name: 'Form Me' }],
  creator: 'Form Me',
  publisher: 'Form Me',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: baseUrl,
    siteName,
    title: siteName,
    description: defaultDescription,
    images: [
      {
        url: '/og-image.png', // À créer
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription,
    images: ['/og-image.png'],
    creator: '@formme',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // À remplacer
  },
};

export function createMetadata({
  title,
  description = defaultDescription,
  keywords = [],
  image,
  path = '',
  noIndex = false,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const ogImage = image || '/og-image.png';

  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords as string[], ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
