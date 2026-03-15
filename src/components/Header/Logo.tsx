// import Link from "next/link"
// import Image from "next/image"
// import profileImg from "@/public/image/profile-img.png"

// const Logo = ({user} : any) => {

//   var link = "/userprofile"
//   if(user.userId == '' || user == null){
//     link = "/signin"
    
//   }
//   return ( 
//     <Link href={link} className="flex items-center text-dark dark:text-light">
//         <div className=" w-12 md:w-16 rounded-full overflow-hidden border border-solid border-dark dark:border-gray  mr-2 md:mr-4">
//         {user.userId != '' ? (
//           <Image src={user.profilePicture} alt={user.username} width={20} height={20} className="w-full h-auto rounded-full" quality={35} />
//         ) : (
//           <></>
//         )}
//         </div>
//         <span className="font-bold dark:font-semibold text-lg md:text-xl">{user.username || "awol"}</span>
//     </Link>
//   )
// }

// export default Logo

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import profileImg from "@/public/image/profile-img.png";

const Logo = ({ user }: any) => {

  let link = "/userprofile";
  if (!user || user.userId === "") {
    link = "/signin";
  }

  return (
    <Link href={link} className="flex items-center">

      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 md:w-14 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 mr-3"
      >
        <Image
          src={user?.profilePicture || profileImg}
          alt="awol"
          width={50}
          height={50}
          className="rounded-full"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-lg md:text-xl"
      >
        {user?.username || "Awol"}
      </motion.span>

    </Link>
  );
};

export default Logo;