'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoffeeBean {
  id: number;
  x: number;
  rotation: number;
  delay: number;
  side: 'left' | 'right';
}

const CoffeePourAnimation = () => {
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mugTopPosition, setMugTopPosition] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMugTopPosition(window.innerHeight - 38);
    }
  }, []);

  useEffect(() => {
    let lastScrollY = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY !== lastScrollY) {
          setIsScrolling(true);
          clearTimeout(scrollTimeout);

          if (Math.random() > 0.3) {
            const newBean = {
              id: Date.now() + Math.random(),
              x: Math.random() * 16 - 8,
              rotation: Math.random() * 360,
              delay: Math.random() * 0.5,
              side: Math.random() > 0.5 ? 'left' : 'right',
            };
            setBeans((prev) => [...prev, newBean]);
          }

          scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
          }, 200);
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setBeans((prev) => prev.slice(-30));
    }, 3000);

    return () => clearInterval(cleanup);
  }, []);

  const renderBeans = (side: 'left' | 'right') => (
    <AnimatePresence>
      {beans.map(
        (bean) =>
          bean.side === side &&
          mugTopPosition && (
            <motion.div
              key={bean.id}
              initial={{
                y: -20,
                x: 40 + bean.x,
                rotate: bean.rotation,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                y: [-20, mugTopPosition - 100, mugTopPosition - 100],
                opacity: [0, 1, 1],
                rotate: bean.rotation + 360,
                scale: [0.8, 1, 1],
              }}
              exit={{
                y: mugTopPosition,
                opacity: 0,
                transition: {
                  duration: 0.4,
                  ease: 'easeOut',
                },
              }}
              transition={{
                duration: 2.5,
                delay: bean.delay,
                ease: [0.21, 0.53, 0.29, 0.8],
                y: {
                  duration: 2.5,
                  ease: 'easeIn',
                },
              }}
              className="absolute"
            >
              <CoffeeBean />
            </motion.div>
          )
      )}
    </AnimatePresence>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Frame border */}
      <div className="absolute inset-4 border-8 border-[#2c1010]/20 rounded-3xl" />

      {/* Left side container */}
      <div className="absolute left-8 h-full" style={{ width: '120px' }}>
        <div className="absolute inset-0">{renderBeans('left')}</div>
        <div className="absolute bottom-20">
          <NewMug />
        </div>
      </div>

      {/* Right side container */}
      <div className="absolute right-8 h-full" style={{ width: '120px' }}>
        <div className="absolute inset-0">{renderBeans('right')}</div>
        <div className="absolute bottom-20 right-0">
          <NewMug />
        </div>
      </div>
    </div>
  );
};

// Mug component
const NewMug = () => (
  <svg width="100" height="100" viewBox="0 0 297 297">
    <g transform="translate(0, 20)">
      {/* Handle */}
      <path fill="#A56905" d="M243.5,92.5c20.678,0,37.5,16.822,37.5,37.5s-16.822,37.5-37.5,37.5h-1.653"
        strokeWidth="16"
        stroke="#A56905"
        strokeLinecap="round"
      />

      {/* Main mug body */}
      <path fill="#A56905" d="M97,205.5h87c23.159,0,41.667-18.841,41.667-42v-45.99c0-0.158-0.099-0.31-0.235-0.462
        c-12.459-1.376-19.912-5.71-26.683-9.62c-7.365-4.254-13.685-7.928-27.124-7.928c-13.439,0-19.78,3.674-27.145,7.928
        c-8.175,4.721-17.43,10.072-35.158,10.072c-17.728,0-27.153-5.352-35.328-10.072c-5.725-3.307-10.325-6.254-19.325-7.406V163.5
        C54.667,186.659,73.841,205.5,97,205.5z"/>

      {/* Top rim highlight */}
      <path fill="#FFEBD2" d="M54.667,83.912c13,1.327,20.49,5.708,27.332,9.66c7.365,4.254,13.81,7.928,27.248,7.928
        c13.44,0,19.843-3.674,27.209-7.928c8.175-4.722,17.461-10.072,35.189-10.072c17.728,0,26.837,5.352,35.012,10.072
        c5.725,3.307,11.01,6.254,19.01,7.406V61.5h-171V83.912z"/>

      {/* Bottom line */}
      <path fill="#2c1010" d="M289,235.5H8c-4.418,0-8,3.582-8,8s3.582,8,8,8h281c4.418,0,8-3.582,8-8S293.418,235.5,289,235.5z" />
    </g>
  </svg>
);

// Coffee Bean component
const CoffeeBean = () => (
  <svg width="30" height="30" viewBox="0 0 72 72" className="text-[#2c1010]">
    <g>
      <ellipse cx="36" cy="36" rx="19" ry="28" fill="#A57939" />
      <g>
        <path fill="#6A462F" fillRule="evenodd" d="M36 64C35.9846 64 35.981 63.9785 35.9956 63.9736C44.4605 61.1397 50.792 49.7143 50.792 36.0508C50.792 22.3796 44.4534 10.9491 35.9814 8.1232C35.9134 8.10052 35.9283 8 36 8C46.4934 8 55 20.536 55 36C55 51.464 46.4934 64 36 64Z" clipRule="evenodd" />
      </g>
      <g>
        <path fill="#6A462F" fillRule="evenodd" d="M36 60.9996C36 60.9996 30 49.8067 30 35.9996C30 22.2397 35.9591 11.0761 35.9998 11C35.9711 11.0538 33 16.6294 33 23.4996C33 30.4032 36 35.9996 36 35.9996C36 35.9996 39 41.596 39 48.4996C39 55.4032 36 60.9996 36 60.9996Z" clipRule="evenodd" />
      </g>
    </g>
    <g>
      <ellipse cx="36" cy="36" rx="19" ry="28" fill="none" stroke="#000000" strokeWidth="2" />
      <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M36 36C36 36 33 30.4036 33 23.5C33 16.5964 36 11 36 11" />
      <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M36 36C36 36 39 41.5964 39 48.5C39 55.4036 36 61 36 61" />
    </g>
  </svg>
);

export default CoffeePourAnimation;