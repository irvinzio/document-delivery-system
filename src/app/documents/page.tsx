"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Alert } from "@mui/material";

export default function DocumentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [error, setError] = useState("");
  const [viewedDoc, setViewedDoc] = useState<any>(null);
  function handleDownload(doc: any) {
    const matches = doc.content.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      alert("Invalid file format");
      return;
    }
    const mimeType = matches[1];
    const b64Data = matches[2];
    const byteCharacters = atob(b64Data);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name || "document";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getDocumentPreview(doc: any) {
    if (typeof doc.content === "string" && doc.content.startsWith("data:")) {
      const mime = doc.content.split(';')[0].replace('data:', '');
      if (mime.startsWith("image/")) {
        return <img src={doc.content} alt={doc.name} style={{ maxWidth: "100%", maxHeight: 300 }} />;
      }
      if (mime === "application/pdf") {
        return <iframe src={doc.content} title="PDF Preview" style={{ width: "100%", height: 400, border: "none" }} />;
      }
      if (mime.startsWith("text/")) {
        const matches = doc.content.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const decoded = atob(matches[2]);
          return <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{decoded}</Box>;
        }
      }
    }
    return <Typography>Preview not available. Please download the file.</Typography>;
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
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom>Your Documents</Typography>
        <Typography fontWeight="bold" mb={2}>Uploaded Documents</Typography>
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>View Limit</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sent.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.recipientId}</TableCell>
                <TableCell>{doc.viewCount}</TableCell>
                <TableCell>{doc.viewLimit ?? "-"}</TableCell>
                <TableCell>{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : "-"}</TableCell>
                <TableCell><Button size="small" variant="outlined" onClick={() => handleView(doc.id)}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography fontWeight="bold" mb={2}>Received Documents</Typography>
        <Table sx={{ mb: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>View Limit</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {received.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.senderId}</TableCell>
                <TableCell>{doc.viewCount}</TableCell>
                <TableCell>{doc.viewLimit ?? "-"}</TableCell>
                <TableCell>{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : "-"}</TableCell>
                <TableCell><Button size="small" variant="outlined" onClick={() => handleView(doc.id)}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {viewedDoc && (
          <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 2, bgcolor: 'grey.100' }}>
            <Typography variant="h6" mb={2}>Document: {viewedDoc.name}</Typography>
            <Typography mb={2}>Content Preview:</Typography>
            {getDocumentPreview(viewedDoc)}
            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => handleDownload(viewedDoc)}>
              Download
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
