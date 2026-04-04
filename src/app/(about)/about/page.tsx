// import AboutCoverSection from "@/src/components/About/AboutCoverSection";
// import WhatsAppButton from "@/src/components/Buttons/WhatsAppButton";
// import Link from "next/link";

// const About = () => {
//   return (
//     <>
//       <AboutCoverSection />

//       <h2 className="mt-8 font-semibold text-lg md:text-2xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 text-dark dark:text-light dark:font-normal">
//         Interested in our EVs, solar systems, inverters, or other electronics?
//         ⚡ Contact us{" "}
//         <WhatsAppButton message={"Hello, I am interested in learning more about your products and services."} />{" "}
//         and our team will help you find the perfect energy or electronics
//         solution for your home or business.
//       </h2>
//     </>
//   );
// };

// export default About;

import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import WhatsAppButton from "@/src/components/Buttons/WhatsAppButton";

const About = () => {
  return (
    <>
      <AboutCoverSection />

      <div className="mx-5 sm:mx-10 md:mx-16 lg:mx-20 mt-8">
        <h2 className="font-semibold text-lg md:text-2xl text-dark dark:text-light">
          Interested in our EVs, solar systems, inverters, or other electronics?
          ⚡
        </h2>

        <p className="mt-4 text-base md:text-lg">
          Contact us directly on WhatsApp and our team will help you find the
          perfect energy solution for your home or business.
        </p>

        <div className="mt-4">
          <WhatsAppButton message="Hello, I am interested in learning more about your products and services." />
        </div>
      </div>
    </>
  );
};

export default About;