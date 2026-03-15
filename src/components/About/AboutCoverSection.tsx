"use client";

import Image from "next/image"
import profileCharacter from "@/public/image/character.png"

const AboutCoverSection = () => {
  return (
    <section className='w-full md:h-[75vh] border-b-2 border-solid border-dark dark:border-light flex flex-col md:flex-row items-center justify-center text-dark dark:text-light'>

      <div className='w-full md:w-1/2 h-full border-r-2 border-solid border-dark dark:border-light flex justify-center'>
        <Image
          src={profileCharacter}
          alt="AWOL Energy & Electronics"
          className='w-4/5 xs:w-3/4 md:w-full h-full object-contain object-center'
          priority
          sizes="(max-width: 768px) 100vw,(max-width: 1180px) 50vw, 50vw"
          quality={35}
        />
      </div>

      <div className='w-full md:w-1/2 flex flex-col text-left items-start justify-center px-5 xs:p-10 pb-10 lg:px-16'>
        <h2 className='font-bold capitalize text-4xl xs:text-5xl sxl:text-6xl text-center lg:text-left'>
          Powering the Future with Smart Energy
        </h2>

        <p className='font-medium mt-4 text-base'>
          AWOL is a modern electronics and energy solutions platform dedicated
          to providing reliable and innovative technology. We specialize in
          electric vehicles (EVs), solar power systems, solar inverters,
          batteries, and a wide range of smart electronic products designed to
          power homes and businesses.
        </p>

        <p className='font-medium mt-4 text-base'>
          Our mission is to make clean energy and advanced electronics
          accessible, affordable, and reliable for everyone. From renewable
          solar solutions to cutting-edge EV technology, AWOL helps customers
          reduce energy costs while embracing sustainable innovation.
        </p>

        <p className='font-medium mt-4 text-base'>
          At AWOL, we believe the future is electric, sustainable, and
          technology-driven — and we are proud to help power that future.
        </p>
      </div>

    </section>
  )
}

export default AboutCoverSection