import Image from "next/image"
import profileCharacter from "../../../../public/image/character.png"
import siteMetadata from "@/src/utils/sitemetadata"

export const metadata = {
  title: "Privacy Policy",
  description: `Read the privacy policy of AWOL to understand how we collect, use, and protect your data. Contact us at ${siteMetadata.email} for questions.`,
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
        <h2 className="font-bold capitalize text-2xl xs:text-3xl sm:text-4xl">
          Privacy Policy
        </h2>

        <p className="mt-6 text-base md:text-lg leading-relaxed">
          At AWOL, your privacy is important to us. This privacy policy explains
          how we collect, use, and protect your personal information when you
          visit our website, purchase our products, or interact with our
          services.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">
          Information We Collect
        </h3>

        <p className="mt-2 text-base md:text-lg leading-relaxed">
          We may collect personal information such as your name, phone number,
          email address, delivery address, and payment information when you
          place an order or contact us. We may also collect technical data such
          as browser type, device information, and website usage statistics to
          improve our platform.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">
          How We Use Your Information
        </h3>

        <p className="mt-2 text-base md:text-lg leading-relaxed">
          Your information is used to process orders, deliver products, provide
          customer support, send order updates, improve our services, and ensure
          website security. It also helps us enhance your shopping experience on
          AWOL.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">
          Sharing Your Information
        </h3>

        <p className="mt-2 text-base md:text-lg leading-relaxed">
          We do not sell or rent your personal information to third parties. We
          may share limited information with trusted partners such as payment
          processors, delivery services, or service providers strictly for the
          purpose of fulfilling your order or operating our business.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">
          Data Protection
        </h3>

        <p className="mt-2 text-base md:text-lg leading-relaxed">
          We implement appropriate security measures to protect your data
          against unauthorized access, alteration, disclosure, or destruction.
          Your personal information is handled with care and stored securely.
        </p>

        <h3 className="mt-6 font-semibold text-xl xs:text-2xl">
          Contact Us
        </h3>

        <p className="mt-2 text-base md:text-lg leading-relaxed">
          If you have questions about this Privacy Policy or how your data is
          handled, please contact us at{" "}
          <a href={`mailto:${siteMetadata.email}`} className="underline underline-offset-2">
            {siteMetadata.email}
          </a>.
        </p>
      </div>
    </section>
  )
}

export default PrivacyPolicy