"use client";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

export default function Navbar() {
  const router = useRouter();
  async function handleSignOut() {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/login" });
  }
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" color="primary" onClick={() => router.push("/documents")}>Document List</Button>
        <Button variant="outlined" color="secondary" onClick={() => router.push("/upload")}>Upload Document</Button>
        <Button variant="contained" color="error" onClick={handleSignOut}>Sign Out</Button>
      </Toolbar>
    </AppBar>
  );
}
