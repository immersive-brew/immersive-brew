'use client';

import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface Position {
  left: number;
  width: number;
  opacity: number;
}

interface TabProps {
  children: React.ReactNode;
  setPosition: (position: Position) => void;
  href: string;
  subhref: string[];
}

const Navbar = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
    >
      <Tab setPosition={setPosition} href="/protected">Home</Tab>
      <Tab setPosition={setPosition} href="/protected/journal">Journal</Tab>
      <Tab setPosition={setPosition} href="/protected/brewguides">BrewGuides</Tab>
      <Tab setPosition={setPosition} href="/protected/profile">Profile</Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition, href, subhref }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  if(subhref) {
    return (
      <li
        ref={ref}
        onMouseEnter={() => {
          if (!ref.current) return;

          const { width } = ref.current.getBoundingClientRect();

          setPosition({
            left: ref.current.offsetLeft,
            width,
            opacity: 1,
          });

          setSubMenuOpen(true);
        }}
        onMouseLeave={() => {
          setSubMenuOpen(false);
        }}
        className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
      >
        <Link href={href}>{children}</Link>
        
      </li>
    );
  }

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

interface CursorProps {
  position: Position;
}

const Cursor = ({ position }: CursorProps) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 w-36 rounded-full bg-black md:h-12"
    />
  );
};

export default Navbar;
