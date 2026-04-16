// import React from 'react'
// import { DribbbleIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from '../icon'
// import Link from 'next/link'
// import siteMetadata from '@/src/utils/sitemetadata'

// const Footer = () => {
//   return (
//     <footer className="mt-16 rounded-2xl bg-dark dark:bg-accentDark/90 m-2 sm:m-10 flex flex-col items-center text-light dark:text-dark">
//       <h3 className="mt-16 font-medium dark:font-bold text-center capitalize text-2xl sm:text-3xl lg:text-4xl px-4">
//         Interesting Stories | Updates | Guides
//       </h3>
//       <p className="mt-5 px-4 text-center w-full sm:w-3/5 font-light dark:font-medium text-sm sm:text-base">
//         Subscribe to learn about new technology and updates. Join over 5000+
//         members community to stay up to date with latest news.
//       </p>

//       <form
//         // onSubmit={handleSubmit(onSubmit)}
//         className="mt-6 w-fit sm:min-w-[384px] flex items-stretch bg-light dark:bg-dark p-1 sm:p-2 rounded mx04"
//       >
//         <input
//           type="email"
//           placeholder="Enter your email"
//         //   {...register("email", { required: true, maxLength: 80 })}
//           className="w-full bg-transparent pl-2 sm:pl-0 text-dark focus:border-dark focus:ring-0 border-0 border-b mr-2 pb-1"
//         />

//         <input
//           type="submit"
//           className="bg-dark text-light dark:text-dark dark:bg-light cursor-pointer font-medium rounded px-3 sm:px-5 py-1"
//         />
//       </form>
//       <div className="flex items-center mt-8">
//         <a
//           href={siteMetadata.linkedin}
//           className="inline-block w-6 h-6 mr-4"
//           aria-label="Reach out to me via LinkedIn"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <LinkedinIcon className="hover:scale-125 transition-all ease duration-200" />
//         </a>
//         <a
//           href={siteMetadata.twitter}
//           className="inline-block w-6 h-6 mr-4"
//           aria-label="Reach out to me via Twitter"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <TwitterIcon className="hover:scale-125 transition-all ease duration-200" />
//         </a>
//         <a
//           href={siteMetadata.facebook}
//           className="inline-block w-6 h-6 mr-4 fill-light"
//           aria-label="Reach out to me via Facebook"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FacebookIcon className="fill-light dark:fill-dark  hover:scale-125 transition-all ease duration-200" />
//         </a>
//         <a
//           href={siteMetadata.dribbble}
//           className="inline-block w-6 h-6 mr-4"
//           aria-label="Check my profile on Dribbble"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <DribbbleIcon className="hover:scale-125 transition-all ease duration-200" />
//         </a>
//       </div>

//       <div className="w-full  mt-16 md:mt-24 relative font-medium border-t border-solid border-light py-6 px-8 flex  flex-col md:flex-row items-center justify-between">
//         <span className="text-center">
//           &copy;2024 maoltech. All rights reserved.
//         </span>
//         <Link
//           href="/sitemap.xml"
//           className="text-center underline my-4 md:my-0"
//         >
//           sitemap.xml
//         </Link>
//         <Link href="/privacy-policy" className="underline text-center">Privacy Policy</Link>
//         <div className="text-center">
//           Made with &hearts; by{" "}
//           <a href="https://github.com/maoltech" className="underline" target="_blank">
//             maoltech
//           </a>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer

"use client";

import React from "react";
import Link from "next/link";
import {
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  DribbbleIcon,
} from "../icon";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 mx-3 sm:mx-10 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-2xl overflow-hidden">

      {/* TOP SECTION */}
      <div className="px-6 py-14 text-center space-y-5">
        <h3 className="text-3xl sm:text-4xl font-bold">
          Powering Your Business ⚡
        </h3>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-green-100">
          Get updates on new products, energy solutions, and flexible
          installment offers from AWOL.
        </p>

        {/* NEWSLETTER */}
        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-black text-white font-semibold hover:scale-105 transition"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* MIDDLE LINKS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-10 bg-white/10 backdrop-blur-md">

        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/about">About AWOL</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/careers">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Developers</h4>
          <ul className="space-y-2 text-sm text-green-100">
            <li><Link href="/api">API Docs</Link></li>
            <li><Link href="/status">System Status</Link></li>
            <li><Link href="/sitemap.xml">Sitemap</Link></li>
          </ul>
        </div>
      </div>

      {/* SOCIAL */}
      <div className="flex justify-center gap-6 py-6 bg-white/5">
        <a href="#" className="hover:scale-125 transition">
          <LinkedinIcon />
        </a>
        <a href="#" className="hover:scale-125 transition">
          <TwitterIcon />
        </a>
        <a href="#" className="hover:scale-125 transition">
          <FacebookIcon />
        </a>
        <a href="#" className="hover:scale-125 transition">
          <DribbbleIcon />
        </a>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-6 text-sm bg-black/20">
        <span>© {year} AWOL. All rights reserved.</span>

        <div className="flex gap-4 my-3 md:my-0">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>

        <span className="text-green-200">
          Built with ⚡ by AWOL Team
        </span>
      </div>
    </footer>
  );
};

export default Footer;