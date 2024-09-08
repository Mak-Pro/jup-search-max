"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Home from "@public/icons/nav-home-icon.svg";
import Tasks from "@public/icons/nav-tasks-icon.svg";
import Friends from "@public/icons/nav-friends-icon.svg";
import Portfolio from "@public/icons/nav-portfolio-icon.svg";
import Search from "@public/icons/nav-search-icon.svg";

import styles from "./style.module.scss";

const navigationItems = [
  { link: "/", icon: <Home />, text: "Home" },
  { link: "/tasks", icon: <Tasks />, text: "Tasks" },
  { link: "/search", icon: <Search />, text: "Trade" },
  { link: "/friends", icon: <Friends />, text: "Friends" },
  {
    link: "/portfolio",
    altLink: "/portfolio/trade",
    icon: <Portfolio />,
    text: "Portfolio",
  },
];

export const Navigation = () => {
  const path = usePathname();

  return (
    <nav className={styles.nav}>
      {navigationItems.map((item) => (
        <div
          key={item.text}
          className={`${styles.nav__item} ${
            path === item.link || path === item.altLink
              ? styles.nav__item_active
              : ""
          }`}
        >
          <Link href={item.link} className={styles.nav__item_link}>
            Link
          </Link>
          <div className={styles.nav__item_icon}>{item.icon}</div>
          <span className={styles.nav__item_text}>{item.text}</span>
        </div>
      ))}
    </nav>
  );
};
