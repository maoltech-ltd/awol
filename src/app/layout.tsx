import siteMetadata from "../utils/sitemetadata";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import Script from "next/script";

// Local fonts
const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-in",
});

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope/Manrope-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-mr",
});

// JSON-LD
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Naijup",
  url: "https://naijup.ng",
  logo: "https://naijup.ng/image/naijup-logo.png",
  sameAs: ["https://x.com/official_naijup", "https://facebook.com/naijup"],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://naijup.ng" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://naijup.ng/blog" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  icons: {
    icon: "/image/favicon.ico", 
    shortcut: "/image/favicon.ico",
    apple: "/image/naijup-logo.png" 
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1200,
        height: 630,
        alt: `${siteMetadata.title} Social Banner`,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    description: siteMetadata.description,
    creator: "@maoltech",
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* JSON-LD Organization */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />

        {/* JSON-LD Breadcrumb */}
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
          {/* Google Adsense */}
          <Script
            id="google-adsense"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9335680421453806"
            crossOrigin="anonymous"
          />

          {/* Google Analytics */}
    

        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-933643807" strategy="afterInteractive" crossOrigin="anonymous"></Script>
        <Script id="google-analytics" strategy="afterInteractive" crossOrigin="anonymous">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-933643807');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-mr bg-light dark:bg-dark`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
