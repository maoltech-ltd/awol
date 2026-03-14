import AboutCoverSection from "@/src/components/About/AboutCoverSection";
import Link from "next/link";

const About = () => {
  return (
    <>
      <AboutCoverSection />
      <h2 className="mt-8 font-semibold text-lg md:text-2xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 text-dark dark:text-light dark:font-normal">
        Want to showcase your brand or promote your business? 📢 Get in touch
        with us{" "}
        <Link href="/contact" className="!underline underline-offset-2">
          here
        </Link>{" "}
        and let&apos;s create the visibility your business deserves.
      </h2>
    </>
  );
};

export default About;
