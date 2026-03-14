import siteMetadata from "../utils/sitemetadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      template: `%s | ${siteMetadata.title}`,
      default: siteMetadata.title,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.author, url: siteMetadata.linkedin }],
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
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
    category: "Finance Blog",
  };
  