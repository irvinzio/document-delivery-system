"use client";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const { data: session } = useSession();
  if (!session) return null;
  return <Navbar />;
}
