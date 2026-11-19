import React from 'react';
import { Lodge } from '@/types/database';
import { getAppBaseUrl } from '@/lib/utils';

const BASE_URL = getAppBaseUrl();

/**
 * Root Website Schema with SearchAction for Google Sitelinks Search Box
 */
export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'LodgeHere',
    alternateName: ['Lodge Here', 'LodgeHere Nigeria', 'LodgeHere Student Accommodation'],
    description:
      'Verified student accommodation across Nigerian campuses. Direct landlord listings, 100% zero agent fees, transparent pricing, and physical inspections.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-NG',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema for Knowledge Graph and AI Answer Engines
 */
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'LodgeHere',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    description:
      "Nigeria's verified student accommodation network connecting university students directly with verified landlords and caretakers.",
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    knowsAbout: [
      'Student Accommodation in Nigeria',
      'Off-Campus Student Housing',
      'University of Lagos (UNILAG) Lodges',
      'University of Ibadan (UI) Lodges',
      'Obafemi Awolowo University (OAU) Lodges',
      'University of Nigeria Nsukka (UNN) Lodges',
      'University of Benin (UNIBEN) Lodges',
      'Federal University of Technology Akure (FUTA) Lodges',
      'Zero Agent Fee Student Rentals',
      'Physical Lodge Inspection Booking',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'NG',
      availableLanguage: ['en'],
      url: `${BASE_URL}/report`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema for Google Featured Snippets and AI Overviews (Perplexity, ChatGPT, SGE)
 */
export function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find verified off-campus student accommodation in Nigeria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LodgeHere allows Nigerian university students to discover verified off-campus lodges with transparent pricing, direct landlord contacts, zero agent fees, and mandatory physical inspection scheduling before making any payment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are there middleman or agent fees on LodgeHere?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. LodgeHere operates on a 100% zero agent fee model. Students connect directly with verified property owners and caretakers, avoiding middleman agency and agreement fees typically charged near Nigerian campuses.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does LodgeHere prevent student accommodation scams in Nigeria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LodgeHere protects students by verifying landlord identities, verifying property locations near accredited institutions, providing upfront itemized fee breakdowns (rent, caution deposit, service charge), and enforcing in-person physical inspections prior to booking.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I physically inspect a student lodge before paying rent?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every listing on LodgeHere has an integrated physical inspection scheduler. Students can select convenient date and time slots to meet the caretaker at the property and inspect water, power, security, and room conditions in person.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which Nigerian universities does LodgeHere support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LodgeHere covers all major Nigerian tertiary institutions including University of Lagos (UNILAG), University of Ibadan (UI), Obafemi Awolowo University (OAU), University of Nigeria Nsukka (UNN), University of Benin (UNIBEN), Federal University of Technology Akure (FUTA), University of Ilorin (UNILORIN), Ahmadu Bello University (ABU), and Lagos State University (LASU).',
        },
      },
      {
        '@type': 'Question',
        name: 'What amenities are essential in a Nigerian off-campus student lodge?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Crucial amenities include constant borehole running water, individual prepaid electricity meters, backup power (solar inverter or generator), secure gated perimeter fencing, and close proximity (walkable or single shuttle) to the campus gate.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Accommodation Schema for Individual Lodge Pages
 */
export function AccommodationJsonLd({ lodge }: { lodge: Lodge }) {
  if (!lodge) return null;

  const minPrice = lodge.pricing?.min_price || 0;
  const maxPrice = lodge.pricing?.max_price || minPrice;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: lodge.title,
    description: lodge.description,
    url: `${BASE_URL}/lodges/${lodge.slug}`,
    image: lodge.images && lodge.images.length > 0 ? lodge.images : [`${BASE_URL}/og-image.png`],
    address: {
      '@type': 'PostalAddress',
      streetAddress: lodge.address,
      addressLocality: lodge.neighbourhood || lodge.campus_name,
      addressRegion: lodge.university_name,
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'NG',
    },
    numberOfRooms: lodge.total_rooms || 1,
    amenityFeature: (lodge.amenities || []).map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity.replace(/_/g, ' '),
      value: true,
    })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'NGN',
      lowPrice: minPrice,
      highPrice: maxPrice,
      offerCount: lodge.available_rooms || 1,
      availability:
        lodge.available_rooms && lodge.available_rooms > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: minPrice,
        priceCurrency: 'NGN',
        unitText: 'year',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
