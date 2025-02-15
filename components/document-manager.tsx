"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { FileIcon, Trash2Icon, PencilIcon } from "lucide-react"

interface Document {
  id: string
  naziv: string
  opis: string | null
  tip: string
  url: string
  velicina: number
  uploader: {
    name: string | null
  }
  createdAt: string
}

interface DocumentManagerProps {
  radniNalogId?: string
}

export function DocumentManager({ radniNalogId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [naziv, setNaziv] = useState("")
  const [opis, setOpis] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    fetchDocuments()
  }, []) // Removed radniNalogId from dependencies

  const fetchDocuments = async () => {
    try {
      const url = radniNalogId ? `/api/documents?radniNalogId=${radniNalogId}` : "/api/documents"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Greška",
        description: "Nije moguće dohvatiti dokumente.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Ovdje bismo trebali implementirati logiku za upload datoteke na server ili cloud storage
      // Za potrebe ovog primjera, pretpostavit ćemo da je datoteka uspješno uploadana
      const uploadedFileUrl = "https://example.com/uploaded-file.pdf"

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv,
          opis,
          tip: file.type,
          url: uploadedFileUrl,
          velicina: file.size,
          radniNalogId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Dokument je uspješno uploadan.",
        })
        setNaziv("")
        setOpis("")
        setFile(null)
        fetchDocuments()
      } else {
        throw new Error("Failed to create document")
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Greška",
        description: "Nije moguće uploadati dokument.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (id: string) => {
    if (editingDocumentId === id) {
      try {
        const response = await fetch(`/api/documents/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ naziv, opis }),
        })

        if (response.ok) {
          toast({
            title: "Uspjeh",
            description: "Dokument je uspješno ažuriran.",
          })
          setEditingDocumentId(null)
          fetchDocuments()
        } else {
          throw new Error("Failed to update document")
        }
      } catch (error) {
        console.error("Error updating document:", error)
        toast({
          title: "Greška",
          description: "Nije moguće ažurirati dokument.",
          variant: "destructive",
        })
      }
    } else {
      const documentToEdit = documents.find((doc) => doc.id === id)
      if (documentToEdit) {
        setNaziv(documentToEdit.naziv)
        setOpis(documentToEdit.opis || "")
        setEditingDocumentId(id)
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Uspjeh",
          description: "Dokument je uspješno obrisan.",
        })
        fetchDocuments()
      } else {
        throw new Error("Failed to delete document")
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Greška",
        description: "Nije moguće obrisati dokument.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upravljanje dokumentima</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="naziv">Naziv dokumenta</Label>
            <Input id="naziv" value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="opis">Opis</Label>
            <Textarea id="opis" value={opis} onChange={(e) => setOpis(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Datoteka</Label>
            <Input id="file" type="file" onChange={handleFileChange} required />
          </div>
          <Button type="submit">Upload dokumenta</Button>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Popis dokumenata</h3>
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <FileIcon className="h-8 w-8" />
                  <div>
                    <p className="font-medium">{document.naziv}</p>
                    <p className="text-sm text-gray-500">{document.opis}</p>
                    <p className="text-xs text-gray-400">
                      Uploaded by: {document.uploader.name} | {new Date(document.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(document.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(document.id)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

