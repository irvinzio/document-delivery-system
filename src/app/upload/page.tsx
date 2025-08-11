"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";

export default function UploadPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [viewLimit, setViewLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch users for recipient selection
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data.users));
  }, []);

  if (!session) {
    router.push("/login");
    return null;
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/documents/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, content, recipientId, viewLimit, expiresAt }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Upload failed");
    } else {
      setSuccess("Document uploaded successfully!");
      setName("");
      setContent("");
      setRecipientId("");
      setViewLimit("");
      setExpiresAt("");
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Upload Document</Heading>
      <form onSubmit={handleUpload}>
        <Box mb={4}>
          <label>Document Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </Box>
        <Box mb={4}>
          <label>Content (base64/text)</label>
          <Input value={content} onChange={e => setContent(e.target.value)} required />
        </Box>
        <Box mb={4}>
          <label>Recipient</label>
          <select value={recipientId} onChange={e => setRecipientId(e.target.value)} required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="">Select recipient</option>
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </Box>
        <Box mb={4}>
          <label>View Limit (optional)</label>
          <input type="number" value={viewLimit} onChange={e => setViewLimit(e.target.value)} min={1} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </Box>
        <Box mb={4}>
          <label>Expiration Date (optional)</label>
          <Input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
        </Box>
        {error && <Text color="red.500" mb={2}>{error}</Text>}
        {success && <Text color="green.500" mb={2}>{success}</Text>}
        <Button type="submit" colorScheme="blue" w="full">Upload</Button>
      </form>
    </Box>
  );
}
