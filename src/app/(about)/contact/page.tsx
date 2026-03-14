import Image from "next/image"
import profileCharacter from "../../../../public/image/character.png"
import siteMetadata from "@/src/utils/sitemetadata";


export const metadata = {
    title: "Contact Us",
    description: `Contact us through the form available on this page or email me at ${siteMetadata.email}`,
};

const Contact = () => {
  return (
    <section className="w-full h-auto md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex  flex-col md:flex-row items-center justify-center text-dark dark:text-light">
        <div className="inline-block w-full sm:w-4/5 md:w-2/5 h-full md:border-r-2 border-solid border-dark dark:border-light">
        <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'> 
            <Image src={profileCharacter} alt="CodeBucks" 
                className='w-4/5  xs:w-3/4 md:w-full h-full object-contain object-center'
                priority
                sizes="(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw"
                quality={35}
            />
        </div>
        </div>
        <div className="w-full  md:w-3/5 flex flex-col items-start justify-center px-5 xs:px-10 md:px-16 pb-8">
            <h2 className="font-bold capitalize text-2xl xs:text-3xl sm:text-4xl">Let&apos;s Connect!</h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed">
            You can reach out to us via email at{" "}
            <a href="mailto:admin@naijup.ng" className="underline underline-offset-2">
                admin@naijup.ng
            </a>.
            </p>
            <p className="mt-4 text-base md:text-lg leading-relaxed">
            Follow us on social media for updates, news, and insights:
            </p>
            <ul className="mt-2 text-base md:text-lg space-y-2">
            <li>
                Twitter/X:{" "}
                <a href="https://x.com/official_naijup" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                @official_naijup
                </a>
            </li>
            <li>
                Instagram:{" "}
                <a href="https://instagram.com/official_naijup" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                @official_naijup
                </a>
            </li>
            </ul>
            <p className="mt-6 text-base md:text-lg leading-relaxed">
            We&apos;d love to hear from you and help you stay informed on finance, business, and crypto in Nigeria!
            </p>
        </div>
  </section>
  )
}

export default Contact

