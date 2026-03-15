import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import Link from "next/link";

const About = () => {
  return (
    <>
      <AboutCoverSection />

      <h2 className="mt-8 font-semibold text-lg md:text-2xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 text-dark dark:text-light dark:font-normal">
        Interested in our EVs, solar systems, inverters, or other electronics?
        ⚡ Contact us{" "}
        <Link href="/contact" className="!underline underline-offset-2">
          here
        </Link>{" "}
        and our team will help you find the perfect energy or electronics
        solution for your home or business.
      </h2>
    </>
  );
};

export default About;