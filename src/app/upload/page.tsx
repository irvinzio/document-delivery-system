"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Button, TextField, Typography, Alert, MenuItem, Box } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";



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
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom>Upload Document</Typography>
        <form onSubmit={handleUpload}>
          <TextField
            label="Document Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.html,.htm,.jpg,.png,.jpeg,.csv,.xlsx,.xls,.json,.xml,.md,.zip,.rar,.ppt,.pptx,.odt,.ods,.odp,.rtf,.gif,.bmp,.svg,.webp,.mp3,.mp4,.wav,.avi,.mov,.mkv,.flac,.ogg,.aac,.ts,.m4a,.m4v,.apk,.exe,.dmg,.iso,.tar,.gz,.7z,.psd,.ai,.eps,.ttf,.otf,.woff,.woff2,.eot,.csv,.tsv,.yaml,.yml,.log,.conf,.ini,.bat,.sh,.c,.cpp,.h,.hpp,.java,.py,.rb,.go,.rs,.swift,.kt,.dart,.php,.asp,.aspx,.jsp,.html,.htm"
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
              Selected file: {file.name}
            </Typography>
          )}
          <TextField
            select
            label="Recipient"
            value={recipientId}
            onChange={e => setRecipientId(e.target.value)}
            required
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select recipient</MenuItem>
            {users.map((u: any) => (
              <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
            ))}
          </TextField>
          <TextField
            label="View Limit (optional)"
            type="number"
            value={viewLimit}
            onChange={e => setViewLimit(e.target.value)}
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }}
          />
           <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DatePicker
              label="Expiration Date (optional)"
              value={expiresAt ? dayjs(expiresAt) : null}
              onChange={e => setExpiresAt(e ? e.format() : "")}
            />
           </LocalizationProvider>
         
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Upload</Button>
        </form>
      </Box>
    </Container>
  );
}
