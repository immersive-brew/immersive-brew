// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import React, { useState, useRef, useEffect } from 'react';
// import Link from 'next/link';
// import { Coffee, Home, Book, User, Search, Bell, Sun } from 'lucide-react';


// // Icon animations and other UI components
// const SteamAnimation = () => (
//   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//     {[...Array(3)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute w-1 h-1 bg-white/20 rounded-full"
//         animate={{
//           y: [-10, -30],
//           x: [0, i === 0 ? -10 : i === 2 ? 10 : 0],
//           scale: [0, 1.5, 0],
//           opacity: [0, 0.5, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           delay: i * 0.3,
//           ease: "easeOut",
//         }}
//       />
//     ))}
//   </div>
// );

// const CoffeeRipple = () => (
//   <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
//     {[...Array(3)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute inset-0 border-2 border-[#2c1010] rounded-full"
//         animate={{
//           scale: [1, 2],
//           opacity: [0.3, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           delay: i * 0.6,
//           ease: "easeOut",
//         }}
//       />
//     ))}
//   </div>
// );

// // Tab component
// const Tab = ({ children, setPosition, href, icon }: { 
//   children: React.ReactNode; 
//   setPosition: (position: { left: number; width: number; opacity: number; }) => void;
//   href: string;
//   icon: React.ReactNode;
// }) => {
//   const ref = useRef<HTMLLIElement>(null);
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     if (!ref.current) return;
//     const { width } = ref.current.getBoundingClientRect();
//     setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
//   };

//   return (
//     <li
//       ref={ref}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={() => setIsHovered(false)}
//       className="relative z-10 cursor-pointer"
//     >
//       <Link href={href}>
//         <motion.div className="px-4 py-2 flex items-center space-x-2 text-sm uppercase text-white mix-blend-difference md:text-base relative" whileHover={{ scale: 1.05 }}>
//           <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
//             {icon}
//           </motion.div>
//           <span>{children}</span>
//         </motion.div>
//       </Link>
//     </li>
//   );
// };

// // Cursor component
// const Cursor = ({ position }: { position: { left: number; width: number; opacity: number; } }) => (
//   <motion.li
//     animate={position}
//     className="absolute z-0 h-10 rounded-full transition-all duration-200 ease-in-out"
//     style={{ background: '#2c1010' }}
//   />
// );

// const Navbar = () => {
//   const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeTab, setActiveTab] = useState<string>('');
//   const [showDropIndicator, setShowDropIndicator] = useState(false);
//   const [weather, setWeather] = useState({ temp: "75°F", condition: "Sunny" });

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     if (activeTab) {
//       setShowDropIndicator(true);
//       const timer = setTimeout(() => setShowDropIndicator(false), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [activeTab]);

//   return (
//     <nav className={`w-full transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
//       <div className="max-w-7xl mx-auto px-4 h-full">
//         <div className="flex items-center justify-between h-full">
//           {/* Main Navigation - Centered */}
//           <div className="flex-1 flex justify-center">
//             <div className="relative">
//               <ul
//                 onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
//                 className={`relative mx-auto flex w-fit rounded-full border-2 border-[#2c1010] bg-white overflow-hidden transition-all duration-300 ${isScrolled ? 'p-1' : 'p-2'}`}
//               >
//                 <Tab setPosition={setPosition} href="/protected" icon={<Home className="h-5 w-5" />}>Home</Tab>
//                 <Tab setPosition={setPosition} href="/protected/journal" icon={<Book className="h-5 w-5" />}>Journal</Tab>
//                 <Tab setPosition={setPosition} href="/protected/brewguides" icon={<Coffee className="h-5 w-5" />}>BrewGuides</Tab>
//                 <Tab setPosition={setPosition} href="/protected/profile" icon={<User className="h-5 w-5" />}>Profile</Tab>
//                 <Tab setPosition={setPosition} href="/protected/coffeebeans" icon={<Coffee className="h-5 w-5" />}>CoffeeBeans</Tab>
//                 <Tab setPosition={setPosition} href="/protected/espressojournalpage" icon={<Coffee className="h-5 w-5" />}>Espresso</Tab>
//                 <div className="w-6"></div>
//                 <CoffeeRipple />
//                 <Cursor position={position} />
//               </ul>
//             </div>
//           </div>

//           {/* Right Side Actions */}
//           <div className="flex items-center">
//             {/* Weather Display */}
//             <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full border-2 border-[#2c1010]">
//               <Sun className="h-5 w-5 text-yellow-500" />
//               <span className="text-[#2c1010] font-medium">{weather.temp}</span>
//               <span className="text-[#2c1010]/70">|</span>
//               <span className="text-[#2c1010]">{weather.condition}</span>
//             </div>

//             {/* Search and Notifications */}
//             <div className="flex items-center space-x-6 ml-12">
//               <div className="relative">
//                 <AnimatePresence>
//                   {isSearchOpen && (
//                     <motion.input
//                       initial={{ width: 0, opacity: 0 }}
//                       animate={{ width: '200px', opacity: 1 }}
//                       exit={{ width: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="rounded-full border border-[#2c1010] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c1010]"
//                       placeholder="Search..."
//                     />
//                   )}
//                 </AnimatePresence>
//                 <motion.button
//                   whileHover={{ scale: 1.1, rotate: 15 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsSearchOpen(!isSearchOpen)}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2c1010]"
//                 >
//                   <Search className="h-5 w-5" />
//                 </motion.button>
//               </div>

//               <div className="relative">
//                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
//                   <Bell className="h-5 w-5 text-[#2c1010]" />
//                   <motion.span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
//                     2
//                   </motion.span>
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import React, { useState, useRef, useEffect } from 'react';
// import Link from 'next/link';
// import { Coffee, Home, Book, User, Search, Bell, Sun } from 'lucide-react';
// import DarkModeButton from './DarkModeButton';

// // Icon animations and other UI components
// const SteamAnimation = () => (
//   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//     {[...Array(3)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute w-1 h-1 bg-white/20 rounded-full"
//         animate={{
//           y: [-10, -30],
//           x: [0, i === 0 ? -10 : i === 2 ? 10 : 0],
//           scale: [0, 1.5, 0],
//           opacity: [0, 0.5, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           delay: i * 0.3,
//           ease: "easeOut",
//         }}
//       />
//     ))}
//   </div>
// );

// const CoffeeRipple = () => (
//   <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
//     {[...Array(3)].map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute inset-0 border-2 border-[#2c1010] dark:border-white rounded-full"
//         animate={{
//           scale: [1, 2],
//           opacity: [0.3, 0],
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           delay: i * 0.6,
//           ease: "easeOut",
//         }}
//       />
//     ))}
//   </div>
// );

// // Tab component
// const Tab = ({ children, setPosition, href, icon }: { 
//   children: React.ReactNode; 
//   setPosition: (position: { left: number; width: number; opacity: number; }) => void;
//   href: string;
//   icon: React.ReactNode;
// }) => {
//   const ref = useRef<HTMLLIElement>(null);
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     if (!ref.current) return;
//     const { width } = ref.current.getBoundingClientRect();
//     setPosition({ left: ref.current.offsetLeft, width, opacity: 1 });
//   };

//   return (
//     <li
//       ref={ref}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={() => setIsHovered(false)}
//       className="relative z-10 cursor-pointer"
//     >
//       <Link href={href}>
//         <motion.div className="px-4 py-2 flex items-center space-x-2 text-sm uppercase text-white mix-blend-difference md:text-base relative" whileHover={{ scale: 1.05 }}>
//           <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
//             {icon}
//           </motion.div>
//           <span>{children}</span>
//         </motion.div>
//       </Link>
//     </li>
//   );
// };

// // Cursor component
// const Cursor = ({ position }: { position: { left: number; width: number; opacity: number; } }) => (
//   <motion.li
//     animate={position}
//     className="absolute z-0 h-10 rounded-full transition-all duration-200 ease-in-out"
//     style={{ background: '#2c1010' }}
//   />
// );

// const Navbar = () => {
//   const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [activeTab, setActiveTab] = useState<string>('');
//   const [showDropIndicator, setShowDropIndicator] = useState(false);
//   const [weather, setWeather] = useState({ temp: "75°F", condition: "Sunny" });

//   useEffect(() => {
//     const controlNavbar = () => {
//       const currentScrollY = window.scrollY;
      
//       if (currentScrollY < lastScrollY || currentScrollY < 10) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }

//       setIsScrolled(currentScrollY > 20);
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', controlNavbar);
//     return () => window.removeEventListener('scroll', controlNavbar);
//   }, [lastScrollY]);

//   useEffect(() => {
//     if (activeTab) {
//       setShowDropIndicator(true);
//       const timer = setTimeout(() => setShowDropIndicator(false), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [activeTab]);

//   return (
//     <nav 
//       className={`
//         fixed top-11 left-10 w-full z-50 
//         transition-all duration-300 transform bg-transparent
//         ${isVisible ? 'translate-y-0' : '-translate-y-full'}
//         ${isScrolled ? 'h-16' : 'h-20'}
//       `}
//     >
//       <div className="max-w-7xl mx-auto px-4 h-full">
//         <div className="flex items-center justify-between h-full">
//           {/* Main Navigation - Centered */}
//           <div className="flex-1 flex justify-center">
//             <div className="relative">
//               <ul
//                 onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
//                 className={`relative mx-auto flex w-fit rounded-full border-2 border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] overflow-hidden transition-all duration-300 ${isScrolled ? 'p-1' : 'p-2'}`}
//               >
//                 <Tab setPosition={setPosition} href="/protected" icon={<Home className="h-5 w-5" />}>Home</Tab>
//                 <Tab setPosition={setPosition} href="/protected/journal" icon={<Book className="h-5 w-5" />}>Journal</Tab>
//                 <Tab setPosition={setPosition} href="/protected/brewguides" icon={<Coffee className="h-5 w-5" />}>BrewGuides</Tab>
//                 <Tab setPosition={setPosition} href="/protected/profile" icon={<User className="h-5 w-5" />}>Profile</Tab>
//                 <Tab setPosition={setPosition} href="/protected/coffeebeans" icon={<Coffee className="h-5 w-5" />}>CoffeeBeans</Tab>
//                 <Tab setPosition={setPosition} href="/protected/espressojournalpage" icon={<Coffee className="h-5 w-5" />}>Espresso</Tab>
//                 <div className="w-6"></div>
//                 <CoffeeRipple />
//                 <Cursor position={position} />
//               </ul>
//             </div>
//           </div>

//           {/* Right Side Actions */}
//           <div className="flex items-center">
//             {/* Weather Display */}
//             <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-[#2c1010] rounded-full border-2 border-[#2c1010] dark:border-white">
//               <Sun className="h-5 w-5 text-yellow-500" />
//               <span className="text-[#2c1010] dark:text-white font-medium">{weather.temp}</span>
//               <span className="text-[#2c1010]/70 dark:text-white/70">|</span>
//               <span className="text-[#2c1010] dark:text-white">{weather.condition}</span>
//             </div>

//             {/* Search and Notifications */}
//             <div className="flex items-center space-x-6 ml-12">
//               <div className="relative">
//                 <AnimatePresence>
//                   {isSearchOpen && (
//                     <motion.input
//                       initial={{ width: 0, opacity: 0 }}
//                       animate={{ width: '200px', opacity: 1 }}
//                       exit={{ width: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="rounded-full border border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c1010] dark:focus:ring-white dark:text-white"
//                       placeholder="Search..."
//                     />
//                   )}
//                 </AnimatePresence>
//                 <motion.button
//                   whileHover={{ scale: 1.1, rotate: 15 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsSearchOpen(!isSearchOpen)}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2c1010] dark:text-white"
//                 >
//                   <Search className="h-5 w-5" />
//                 </motion.button>
//               </div>

//               <div className="relative">
//                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
//                   <Bell className="h-5 w-5 text-[#2c1010] dark:text-white" />
//                   <motion.span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
//                     2
//                   </motion.span>
//                 </motion.button>
//               </div>

//               {/* Dark Mode Button */}
//               <DarkModeButton />
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

//************************************** */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Home, Book, User, Search, Bell, Sun } from 'lucide-react';
import DarkModeButton from './DarkModeButton';

type Position = { left: number; width: number; opacity: number };

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

const Tab = ({
  children,
  setPosition,
  href,
  icon,
}: {
  children: React.ReactNode;
  setPosition: (position: Position) => void;
  href: string;
  icon: React.ReactNode;
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

  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-10 cursor-pointer"
    >
      <Link href={href}>
        <motion.div
          className="px-4 py-2 flex items-center space-x-2 text-sm uppercase text-white mix-blend-difference md:text-base relative"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.5 }}>
            {icon}
          </motion.div>
          <span>{children}</span>
        </motion.div>
      </Link>
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('');
  const [weather, setWeather] = useState({ temp: '65°F', condition: 'Cloudy' });
 

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

  useEffect(() => {
    if (activeTab) {
      const timer = setTimeout(() => setActiveTab(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  return (
    <nav
      className={`fixed top-9  right-40 w-full z-50 transition-all duration-300 transform bg-transparent ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'h-16' : 'h-20'}`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Main Navigation */}
          <div className="flex-1 flex justify-center">
            <ul
              onMouseLeave={() => setPosition((prev) => ({ ...prev, opacity: 0 }))}
              className={`relative mx-auto flex w-fit rounded-full border-2 border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] overflow-hidden transition-all duration-300 ${
                isScrolled ? 'p-1' : 'p-2'
              }`}
            >
              <Tab setPosition={setPosition} href="/protected" icon={<Home className="h-5 w-5" />}>
                Home
              </Tab>
              <Tab setPosition={setPosition} href="/protected/journal" icon={<Book className="h-5 w-5" />}>
                Journal
              </Tab>
              <Tab setPosition={setPosition} href="/protected/brewguides" icon={<Coffee className="h-5 w-5" />}>
                BrewGuides
              </Tab>
              <Tab setPosition={setPosition} href="/protected/profile" icon={<User className="h-5 w-5" />}>
                Profile
              </Tab>
              <Tab setPosition={setPosition} href="/protected/coffeebeans" icon={<Coffee className="h-5 w-5" />}>
                CoffeeBeans
              </Tab>
              <Tab setPosition={setPosition} href="/protected/espressojournalpage" icon={<Coffee className="h-5 w-5" />}>
                Espresso
              </Tab>
              <CoffeeRipple />
              <Cursor position={position} />
            </ul>
          </div>

          {/* Weather and Actions */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-[#2c1010] rounded-full border-2 border-[#2c1010] dark:border-white">
              <Sun className="h-5 w-5 text-yellow-500" />
              <span className="text-[#2c1010] dark:text-white font-medium">{weather.temp}</span>
              <span className="text-[#2c1010]/70 dark:text-white/70">|</span>
              <span className="text-[#2c1010] dark:text-white">{weather.condition}</span>
            </div>
            <div className="flex items-center space-x-6 ml-12">
              <div className="relative">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '200px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-full border border-[#2c1010] dark:border-white bg-white dark:bg-[#2c1010] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c1010] dark:focus:ring-white dark:text-white"
                      placeholder="Search..."
                    />
                  )}
                </AnimatePresence>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2c1010] dark:text-white"
                >
                  <Search className="h-5 w-5" />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Bell className="h-5 w-5 text-[#2c1010] dark:text-white" />
                <span className="absolute top-0 right-0 block w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
              </motion.button>
               
              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
