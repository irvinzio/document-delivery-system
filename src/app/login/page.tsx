"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    <Box maxW="sm" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Login</Heading>
      <form onSubmit={handleLogin}>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          mb={4}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          mb={4}
        />
        {error && <Text color="red.500" mb={2}>{error}</Text>}
        <Button type="submit" colorScheme="blue" w="full">Login</Button>
      </form>
    </Box>
  );
}
