import Image from "next/image"
import profileCharacter from "../../../../public/image/character.png"
import siteMetadata from "@/src/utils/sitemetadata"

export const metadata = {
  title: "Privacy Policy",
  description: `Read the privacy policy of NaijUp to understand how we collect, use, and protect your data. Contact us at ${siteMetadata.email} for questions.`,
}

const PrivacyPolicy = () => {
  return (
    <section className="w-full h-auto md:h-auto border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light">
      <div className="inline-block w-full sm:w-4/5 md:w-2/5 h-full md:border-r-2 border-solid border-dark dark:border-light">
        <div className="w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center">
          <Image
            src={profileCharacter}
            alt="Privacy Policy"
            className="w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center"
            priority
            sizes="(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw"
            quality={35}
          />
        </div>
      </div>

      <div className="w-full md:w-3/5 flex flex-col items-start justify-center px-5 xs:px-10 md:px-16 pb-8">
        <h2 className="font-bold capitalize text-2xl xs:text-3xl sm:text-4xl">Privacy Policy</h2>
        
        <p className="mt-6 text-base md:text-lg leading-relaxed">
          At NaijUp, your privacy is very important to us. This policy explains how we collect, use, and protect your personal information when you use our website.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">Information We Collect</h3>
        <p className="mt-2 text-base md:text-lg leading-relaxed">
          We may collect personal information such as your name, email address, and any details you provide when subscribing to our newsletter or contacting us.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">How We Use Your Information</h3>
        <p className="mt-2 text-base md:text-lg leading-relaxed">
          Your information is used to provide updates, newsletters, respond to inquiries, improve our services, and maintain website security.
        </p>

        {/* <h3 className="mt-6 font-semibold text-xl xs:text-2xl">Cookies and Tracking</h3>
        <p className="mt-2 text-base md:text-lg leading-relaxed">
          Our website may use cookies and similar tracking technologies to enhance your experience. You can manage your cookie preferences in your browser settings.
        </p> */}

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">Sharing Your Information</h3>
        <p className="mt-2 text-base md:text-lg leading-relaxed">
          We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">Contact Us</h3>
        <p className="mt-2 text-base md:text-lg leading-relaxed">
          If you have any questions about this Privacy Policy, feel free to contact us at{" "}
          <a href={`mailto:${siteMetadata.email}`} className="underline underline-offset-2">
            {siteMetadata.email}
          </a>.
        </p>
      </div>
    </section>
  )
}

export default PrivacyPolicy
