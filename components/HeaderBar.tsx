"use client";

import Link from "next/link";

export default function HeaderBar() {
  return (
    <header className="header-bar">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="/protected/profile">Profile</Link>
          </li>
          <li className="nav-item">
            <Link href="/protected/journal">Journal</Link>
          </li>
          <li className="nav-item">
            <Link href="/protected/brewguides">Brew Guides</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
