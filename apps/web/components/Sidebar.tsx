"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, LayoutDashboard, ListChecks } from "lucide-react";
import styles from "./Sidebar.module.css";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learning-path", label: "Learning Path", icon: BookOpen },
  { href: "/exploration", label: "Exploration", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tracker", label: "Tracker", icon: ListChecks }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar} aria-label="Primary">
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.active : ""}`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
