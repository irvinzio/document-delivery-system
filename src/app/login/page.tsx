"use client";
import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/documents");
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleLogin}>
        <Box mb={4}>
          <label htmlFor="email" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Email</label>
          <Input
            id="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="password" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Password</label>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Box>
        {error && <Text color="red.500" textAlign="center">{error}</Text>}
        <Button type="submit" colorScheme="blue" w="full">Login</Button>
      </form>
    </Box>
  );
}
