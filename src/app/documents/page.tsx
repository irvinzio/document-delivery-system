"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

export default function DocumentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [error, setError] = useState("");
  const [viewedDoc, setViewedDoc] = useState<any>(null);
  function handleDownload(doc: any) {
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }
    fetch("/api/documents/list")
      .then(res => res.json())
      .then(data => {
        setSent(data.sent);
        setReceived(data.received);
      });
  }, [session, router]);

  async function handleView(documentId: string) {
    setError("");
    setViewedDoc(null);
    const res = await fetch("/api/documents/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Access denied");
    } else {
      setViewedDoc(data.document);
    }
  }

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6}>Your Documents</Heading>
      <Text fontWeight="bold" mb={2}>Uploaded Documents</Text>
      <table style={{ width: "100%", marginBottom: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Recipient</th>
            <th>Views</th>
            <th>View Limit</th>
            <th>Expires At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sent.map((doc: any) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.recipientId}</td>
              <td>{doc.viewCount}</td>
              <td>{doc.viewLimit ?? "-"}</td>
              <td>{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : "-"}</td>
              <td><Button size="sm" onClick={() => handleView(doc.id)}>View</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Text fontWeight="bold" mb={2}>Received Documents</Text>
      <table style={{ width: "100%", marginBottom: "1.5rem", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sender</th>
            <th>Views</th>
            <th>View Limit</th>
            <th>Expires At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {received.map((doc: any) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.senderId}</td>
              <td>{doc.viewCount}</td>
              <td>{doc.viewLimit ?? "-"}</td>
              <td>{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : "-"}</td>
              <td><Button size="sm" onClick={() => handleView(doc.id)}>View</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      {viewedDoc && (
        <Box mt={6} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
          <Heading size="md" mb={2}>Document: {viewedDoc.name}</Heading>
          <Text mb={2}>Content:</Text>
          <Box p={2} bg="white" borderWidth={1} borderRadius="md" fontFamily="mono" whiteSpace="pre-wrap">
            {viewedDoc.content}
          </Box>
          <Button mt={4} colorScheme="green" onClick={() => handleDownload(viewedDoc)}>
            Download
          </Button>
        </Box>
      )}
    </Box>
  );
}
