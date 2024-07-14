import Link from "next/link";
import React from "react";

import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const navLinks = [
  {
    label: "Categories",
    href: "#",
  },
  {
    label: "Sales",
    href: "#",
  },
  {
    label: "Clearance",
    href: "#",
  },
  {
    label: "New Stock",
    href: "#",
  },
  {
    label: "Trending",
    href: "#",
  },
];

const NavLinks: React.FC = () => {
  return (
    <ul className="flex items-center justify-between gap-8 text-base font-semibold">
      {navLinks.map((link) => (
        <li key={link.label}>
          <Link href={link.href}>{link.label}</Link>
        </li>
      ))}
    </ul>
  );
};

const Navbar = () => {
  return (
    <nav>
      {/* TOP SECTION */}
      <div className="flex items-center justify-end gap-5 px-10 py-3 text-xs">
        <Link href="#">Help</Link>
        <Link href="#">Orders & Returns</Link>
        <Link href="#">User</Link>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex items-center justify-between px-10 py-4">
        {/* Title */}
        <h1 className="text-3xl font-bold">
          <Link href="/">ECOMMERCE</Link>
        </h1>

        {/* Links */}
        <NavLinks />

        {/* Icons */}
        <div className="flex items-center justify-between gap-8">
          <FiSearch className="cursor-pointer" />
          <FiShoppingCart className="cursor-pointer" />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bg-background-light flex items-center justify-center gap-6 py-3">
        <IoIosArrowBack />
        <p className="text-sm font-medium">Get 10% off on business sign up</p>
        <IoIosArrowForward />
      </div>
    </nav>
  );
};

export default Navbar;
