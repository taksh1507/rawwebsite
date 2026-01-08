/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import Script from 'next/script';

export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TEAM RAW - Robotics and Automation Wing',
    alternateName: 'Team RAW SFIT',
    url: 'https://teamraw.vercel.app',
    logo: 'https://teamraw.vercel.app/logo.png',
    description: 'TEAM RAW is the Robotics and Automation Wing of St. Francis Institute of Technology (SFIT), Mumbai. We participate in national robotics competitions, build innovative automation projects, and drive technological excellence.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mt. Poinsur, S.V.P. Road, Borivali West',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400103',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      email: 'teamraw@sfit.ac.in'
    },
    sameAs: [
      'https://www.instagram.com/teamraw_sfit',
      'https://www.linkedin.com/company/team-raw-sfit',
      'https://www.youtube.com/@teamrawsfit2026'
    ],
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: 'St. Francis Institute of Technology',
      url: 'https://www.sfit.ac.in'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TEAM RAW',
    url: 'https://teamraw.vercel.app',
    description: 'Official website of TEAM RAW - Robotics and Automation Wing of SFIT Mumbai',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://teamraw.vercel.app/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const collegeOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrDepartment',
    name: 'TEAM RAW - Robotics and Automation Wing',
    department: 'Robotics and Automation Wing',
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'St. Francis Institute of Technology',
      alternateName: 'SFIT',
      url: 'https://www.sfit.ac.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mt. Poinsur, S.V.P. Road, Borivali West',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        postalCode: '400103',
        addressCountry: 'IN'
      }
    }
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="college-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeOrganizationSchema) }}
      />
    </>
  );
}
