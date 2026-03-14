import { CategoryProps } from "@/src/utils/props"
import { cs } from "@/src/utils"
import Link from "next/link"

const Category: React.FC<CategoryProps> = ({link ="#", name, ...props}) => {
  return (
    <Link 
      href={link} 
      className={
        cs(
          "inline-block py-2 sm:py-3 px-6 sm:px-10  bg-dark text-light rounded-full capitalize font-semibold border-2 border-solid border-light hover:scale-105 transition-all ease duration-200 text-sm sm:text-base",
          props.className
        )
      }
    >
      {name}
    </Link>
  )
}

export default Category