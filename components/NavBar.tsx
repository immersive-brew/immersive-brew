'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Home, Book, User, ChevronDown } from 'lucide-react';

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
    icon: <Home className="h-5 w-5" />
  },
  {
    label: 'Journal',
    href: '/protected/journal',
    icon: <Book className="h-5 w-5" />,
    subItems: [
      { label: 'View Journal', href: '/protected/journal' },
      { label: 'Upload Journal', href: '/protected/journal/entry' },
      { label: 'Start Brew', href: '/protected/journal/brew/' },
      { label: 'Compare Entries', href: '/protected/journal/compare' },
      { label: 'Share Entry', href: '/protected/generatelink' },
    ]
  },
  
  {
    label: 'BrewGuides',
    href: '/protected/brewguides',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [
      { label: 'View BrewGuides', href: '/protected/brewguides' },
      { label: 'Create Help Thread', href: '/protected/createhelpthread' },
    ]
  },
  {
    label: 'Profile',
    href: '/protected/profile',
    icon: <User className="h-5 w-5" />,
    subItems: [
      { label: 'View Profile', href: '/protected/profile' },
      { label: 'Water Tracker', href: '/protected/WaterTracker' }

    ]
  },
  {
    label: 'CoffeeBeans',
    href: '/protected/coffeebeans',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [
     
      { label: 'Add Coffee Beans', href: '/protected/coffeebeans' },
      { label: 'Coffee-Wheel', href: '/protected/coffeewheel' },
      { label: 'add your sub menu', href: '/protected/coffeebeans/roasters' }
    ]
  },
  {
    label: 'Espresso',
    href: '/protected/espressojournalpage',
    icon: <Coffee className="h-5 w-5" />,
    subItems: [
      { label: 'View Espresso', href: '/protected/espressojournalpage' },
      { label: 'add your sub menu', href: '/protected/espresso/recipes' },
      { label: 'add your sub menu', href: '/protected/espresso/equipment' }
    ]
  }
];

const SteamAnimation = () => (
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full"
        animate={{
          y: [-10, -30],
          x: [0, i === 0 ? -10 : i === 2 ? 10 : 0],
          scale: [0, 1.5, 0],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

const CoffeeRipple = () => (
  <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute inset-0 border-2 border-[#2c1010] dark:border-white rounded-full"
        animate={{
          scale: [1, 2],
          opacity: [0.3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.6,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

const DropdownMenu = ({ subItems, isOpen }: { subItems: SubMenuItem[]; isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-48 rounded-lg bg-white dark:bg-[#2c1010] border-2 border-[#2c1010] dark:border-white shadow-lg overflow-hidden z-[100]"
        style={{ 
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
          transformOrigin: 'top center'
        }}
      >
        <ul className="py-1">
          {subItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="block px-4 py-2 text-sm text-[#2c1010] dark:text-white hover:bg-gray-100 dark:hover:bg-[#3c2020] transition-colors duration-150">
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

const Tab = ({
  item,
  setPosition,
}: {
  item: MenuItem;
  setPosition: (position: Position) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowDropdown(true);
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
    }
  };

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDropdown(false);
      }}
      className="relative z-[60] cursor-pointer group"
    >
      <Link href={item.href}>
        <div className="px-4 py-2 flex items-center space-x-2 text-sm uppercase text-white mix-blend-difference md:text-base relative">
          <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
            {item.icon}
          </motion.div>
          <span>{item.label}</span>
          {item.subItems && (
            <motion.div
              animate={{ rotate: showDropdown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-1"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </Link>
      {item.subItems && <DropdownMenu subItems={item.subItems} isOpen={showDropdown} />}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => (
  <motion.li
    animate={position}
    className="absolute z-0 h-10 rounded-full transition-all duration-200 ease-in-out"
    style={{ background: '#2c1010' }}
  />
);

const Navbar = () => {
  const [position, setPosition] = useState<Position>({ left: 0, width: 0, opacity: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-9 left-1/2 -translate-x-1/2 w-fit z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'h-16' : 'h-20'}`}
    >
      <div className="h-full relative">
        <ul
          onMouseLeave={() => setPosition((prev) => ({ ...prev, opacity: 0 }))}
          className={`relative mx-auto flex w-fit rounded-full border-2 border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] overflow-visible transition-all duration-300 ${
            isScrolled ? 'p-1' : 'p-2'
          }`}
        >
          {menuItems.map((item) => (
            <Tab key={item.href} item={item} setPosition={setPosition} />
          ))}
          <CoffeeRipple />
          <Cursor position={position} />
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;