"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Navbar.module.css"; // Import the CSS module

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-10 ${styles["navbar-transparent"]}`}
    >
      <div className="flex justify-between items-center py-4 px-5">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src="/images/CC Logo.png" // Update the path to start from the public folder
            alt="CreatorHub Logo"
            width={50}
            height={30}
            priority
            style={{ width: "100%", height: "auto", maxWidth: "100px" }}
          />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/creators">
            <Button variant="outline">Explore</Button>
          </Link>
          {user && (
            <>
              <Link href="/wishlist">
                <Button variant="ghost">My Wishlist</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </>
          )}
          {user ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="destructive">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
