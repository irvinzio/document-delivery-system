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
  const [file, setFile] = useState<File | null>(null);

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setContent(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setContent("");
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Upload Document</Heading>
      <form onSubmit={handleUpload}>
        <Box mb={4}>
          <label htmlFor="name" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Document Name</label>
          <Input
            id="name"
            placeholder="Document Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="file" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Select File</label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.html,.htm,.jpg,.png,.jpeg,.csv,.xlsx,.xls,.json,.xml,.md,.zip,.rar,.ppt,.pptx,.odt,.ods,.odp,.rtf,.gif,.bmp,.svg,.webp,.mp3,.mp4,.wav,.avi,.mov,.mkv,.flac,.ogg,.aac,.ts,.m4a,.m4v,.apk,.exe,.dmg,.iso,.tar,.gz,.7z,.psd,.ai,.eps,.ttf,.otf,.woff,.woff2,.eot,.csv,.tsv,.yaml,.yml,.log,.conf,.ini,.bat,.sh,.c,.cpp,.h,.hpp,.java,.py,.rb,.go,.rs,.swift,.kt,.dart,.php,.asp,.aspx,.jsp,.html,.htm"
          />
        </Box>
        <Box mb={4}>
          <label htmlFor="recipient" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Recipient</label>
          <select id="recipient" value={recipientId} onChange={e => setRecipientId(e.target.value)} required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
            <option value="">Select recipient</option>
            {users.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </Box>
        <Box mb={4}>
          <label htmlFor="viewLimit" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>View Limit (optional)</label>
          <input type="number" id="viewLimit" value={viewLimit} onChange={e => setViewLimit(e.target.value)} min={1} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </Box>
        <Box mb={4}>
          <label htmlFor="expiresAt" style={{ fontWeight: "bold", marginBottom: 4, display: "block" }}>Expiration Date (optional)</label>
          <Input type="date" id="expiresAt" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
        </Box>
        {error && <Text color="red.500" textAlign="center">{error}</Text>}
        <Button type="submit" colorScheme="blue" w="full">Upload</Button>
      </form>
    </Box>
  );
}
