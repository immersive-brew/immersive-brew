"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeaderBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  return (
    <header className="header-bar">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/protected">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="/protected/profile">Profile</Link>
          </li>
          
          <li
            className="nav-item"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <Link href="/protected/journal">Journal</Link> {/* Make this clickable */}
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <ul className="dropdown">
                <li className="dropdown-item">
                  <Link href="/protected/journal/brew">Brew</Link>
                </li>
                <li className="dropdown-item">
                  <Link href="/protected/journal/entry">Entry</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link href="/protected/brewguides">Brew Guides</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
