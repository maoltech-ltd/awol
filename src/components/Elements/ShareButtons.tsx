"use client";

import {
  FacebookIcon,
  LinkedinIcon,
  ShareIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../icon";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  // return (
  //   <div className="flex gap-3 items-center mt-6">
  //     <span className="text-dark dark:text-light font-medium flex items-center gap-1">
  //       <ShareIcon className="text-current w-5 h-5" /> Share:
  //     </span>

  //     <a
  //       href={shareLinks.twitter}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="hover:opacity-70"
  //     >
  //       <TwitterIcon className="text-sky-500 hover:opacity-70 transition" />
  //     </a>

  //     <a
  //       href={shareLinks.facebook}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="hover:opacity-70"
  //     >
  //       <FacebookIcon className="text-blue-600 hover:opacity-70 transition" />
  //     </a>

  //     <a
  //       href={shareLinks.whatsapp}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="hover:opacity-70"
  //     >
  //       <WhatsappIcon className="text-green-500 hover:opacity-70 transition" />
  //     </a>

  //     <a
  //       href={shareLinks.linkedin}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="hover:opacity-70"
  //     >
  //       <LinkedinIcon className="text-blue-700 hover:opacity-70 transition" />
  //     </a>
  //   </div>
  // );
  return (
    <div className="flex flex-wrap items-center gap-4 mt-6 px-5 md:px-10">
      <span className="text-dark dark:text-light font-medium flex items-center gap-2">
        <ShareIcon className="text-current w-5 h-5" /> 
        <span className="whitespace-nowrap">Share this post:</span>
      </span>

      <div className="flex items-center gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 transition-all duration-200"
          aria-label="Share on Twitter"
        >
          <TwitterIcon className="text-sky-500 w-5 h-5" />
        </a>

        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200"
          aria-label="Share on Facebook"
        >
          <FacebookIcon className="text-blue-600 w-5 h-5" />
        </a>

        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 transition-all duration-200"
          aria-label="Share on WhatsApp"
        >
          <WhatsappIcon className="text-green-500 w-5 h-5" />
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon className="text-blue-700 w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
