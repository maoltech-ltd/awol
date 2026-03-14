"use client";
import Image from "next/image"
import profileCharacter from "@/public/image/character.png"

const AboutCoverSection = () => {
  return (
    <section className='w-full md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light'>
        <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'> 
            <Image src={profileCharacter} alt="Naijup Character" 
            className='w-4/5  xs:w-3/4 md:w-full h-full object-contain object-center'
            priority
            sizes="(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw"
            quality={35}
            />
        </div>

        <div className='w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16'>
            <h2 className='font-bold capitalize text-4xl xs:text-5xl sxl:text-6xl text-center lg:text-left'>
            Empowering Voices, Driving Africa’s Future
            </h2>
            <p className='font-medium capitalize mt-4 text-base'>
            Naijup is more than a platform—it’s a movement to redefine Africa’s narrative. We cover finance, technology, entrepreneurship, business, and economics with clarity and depth, highlighting the people and ideas shaping tomorrow. Our mission is to connect innovation with opportunity, inspire bold thinking, and amplify stories that drive growth across Nigeria and beyond. At Naijup, we believe every insight can spark change, and every story can shape the future.
            </p>
        </div>
    </section>
  )
}

export default AboutCoverSection
