"use client";
import { Box, Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <Box as="nav" w="100%" bg="gray.100" px={4} py={3} borderBottom="1px" borderColor="gray.200">
      <Flex justify="flex-end" align="center">
        <Button
          colorScheme="blue"
          fontWeight="bold"
          onClick={() => router.push("/upload")}
        >
          Upload Document
        </Button>
      </Flex>
    </Box>
  );
}
