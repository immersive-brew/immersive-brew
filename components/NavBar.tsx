'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Home, Book, User, ChevronDown } from 'lucide-react';
import ModeToggle from './DarkModeButton';

type Position = { left: number; width: number; opacity: number };

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/protected',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Journal',
    href: '/protected/journal',
    icon: <Book className="h-5 w-5" />,
    subItems: [
      { label: 'Upload Manual Entry', href: '/protected/journal/entry' },
      { label: 'Start Brew', href: '/protected/journal/brew/' },
      { label: 'Compare Entries', href: '/protected/journal/compare' },
      { label: 'Share Entry', href: '/protected/generatelink' },
      { label: 'Create Recipe', href: '/protected/recipe' },
    ],
  },
  {
    label: 'BrewGuides',
    href: '/protected/brewguides',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [
      { label: 'Create Help Thread', href: '/protected/createhelpthread' },
      { label: 'Find Local Roasters', href: '/protected/googleplaces' },
      { label: 'Community BTM', href: '/protected/displaycommunity' },
    ],
  },
  {
    label: 'CoffeeBeans',
    href: '/protected/coffeebeans',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [
      { label: 'Add Coffee Beans', href: '/protected/coffeebeans' },
      { label: 'Coffee-Wheel', href: '/protected/coffeewheel' },
      { label: 'Blind Taste Test', href: '/protected/blindtest' },
    ],
  },
  {
    label: 'Espresso',
    href: '/protected/espressojournalpage',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [{ label: 'View Espresso', href: '/protected/espressojournalpage' }],
  },
  {
    label: 'Profile',
    href: '/protected/profile',
    icon: <User className="h-5 w-5" />,
    subItems: [
      { label: 'View Profile', href: '/protected/profile' },
      { label: 'Water Tracker', href: '/protected/WaterTracker' },
      { label: 'View Brewing Tools', href: '/protected/brewingtools' },
    ],
  },
];

const Navbar = () => {
  const [position, setPosition] = useState<Position>({ left: 0, width: 0, opacity: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const controlNavbar = () => {
      const isAtTop = window.scrollY === 0; // Check if the user is at the top of the page
      setIsVisible(isAtTop);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-fit z-50 transition-transform duration-75 transform ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'
        } h-20`}
    >
      <div className="relative mx-auto">
        <ul className="relative flex rounded-full border-2 border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] overflow-visible transition-all duration-200 p-2">
          {menuItems.map((item) => (
            <Tab key={item.href} item={item} setPosition={setPosition} />
          ))}
          <Cursor position={position} />
        </ul>
      </div>

      <ModeToggle />
    </nav>
  );
};

const Tab = ({
  item,
  setPosition,
}: {
  item: MenuItem;
  setPosition: (position: Position) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative z-[60] cursor-pointer group nav-item"
    >
      <Link href={item.href}>
        <div className="px-4 py-2 flex items-center space-x-2 text-sm uppercase text-white mix-blend-difference md:text-base relative">
          <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.2 }}>
            {item.icon}
          </motion.div>
          <span>{item.label}</span>
          {item.subItems && (
            <motion.div
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.1 }}
              className="ml-1"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </Link>
      {item.subItems && <DropdownMenu subItems={item.subItems} isOpen={isHovered} />}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => (
  <motion.li
    animate={position}
    transition={{ duration: 0.15 }}
    className="absolute z-0 h-10 rounded-full transition-all duration-150 ease-in-out"
    style={{ background: '#2c1010' }}
  />
);

const DropdownMenu = ({
  subItems,
  isOpen,
}: {
  subItems: SubMenuItem[];
  isOpen: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-1/2 -translate-x-1/2 w-48 rounded-lg bg-white dark:bg-[#2c1010] border-2 border-[#2c1010] dark:border-white shadow-lg overflow-hidden z-[100] mt-2"
      >
        <ul className="py-1">
          {subItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="block px-4 py-2 text-sm text-[#2c1010] dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c2020] transition-colors duration-100">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Navbar;
