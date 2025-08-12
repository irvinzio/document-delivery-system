"use client";
import { Box, Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  async function handleSignOut() {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/login" });
  }
  return (
    <Box as="nav" w="100%" bg="gray.100" px={4} py={3} borderBottom="1px" borderColor="gray.200">
      <Flex justify="flex-end" align="center" gap={4}>
        <Button
          colorScheme="teal"
          fontWeight="bold"
          onClick={() => router.push("/documents")}
        >
          Document List
        </Button>
        <Button
          colorScheme="blue"
          fontWeight="bold"
          onClick={() => router.push("/upload")}
        >
          Upload Document
        </Button>
        <Button
          colorScheme="red"
          fontWeight="bold"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Flex>
    </Box>
  );
}
