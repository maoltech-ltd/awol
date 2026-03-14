import React from 'react'
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className='flex flex-col items-center justify-center'>
    <Link href="/">
      Home
    </Link>
    <Link href="/blog">
      Blog
    </Link>
  </nav>
  )
}
