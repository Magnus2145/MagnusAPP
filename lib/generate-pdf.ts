import { PDFDocument, StandardFonts } from "pdf-lib"
import { format } from "date-fns"

interface Nalog {
  id: number
  broj: number
  klijent: string
  datum: string
  opis: string
  adresa: string
  kontaktOsoba: string
  telefon: string
  email: string
  status: string
  prioritet: string
  napomena?: string
  serviser_id?: number | null
}

export async function generatePDF(nalog: Nalog, filename: string, print: boolean): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()

  // Set font and styles
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText(`Radni nalog #${nalog.broj}`, {
    x: 50,
    y: 750,
    font,
    size: 24,
  })

  page.drawText(`Klijent: ${nalog.klijent}`, { x: 50, y: 700, font })
  page.drawText(`Datum: ${format(new Date(nalog.datum), "dd.MM.yyyy")}`, { x: 50, y: 670, font })
  page.drawText(`Status: ${nalog.status}`, { x: 50, y: 640, font })
  page.drawText(`Prioritet: ${nalog.prioritet}`, { x: 50, y: 610, font })
  page.drawText(`Adresa: ${nalog.adresa}`, { x: 50, y: 580, font })
  page.drawText(`Kontakt osoba: ${nalog.kontaktOsoba}`, { x: 50, y: 550, font })
  page.drawText(`Telefon: ${nalog.telefon}`, { x: 50, y: 520, font })
  page.drawText(`Email: ${nalog.email}`, { x: 50, y: 490, font })

  page.drawText(`Opis posla:`, { x: 50, y: 440, font, size: 16 })
  page.drawText(nalog.opis, { x: 50, y: 400, font })

  if (nalog.napomena) {
    page.drawText(`Napomena:`, { x: 50, y: 300, font, size: 16 })
    page.drawText(nalog.napomena, { x: 50, y: 260, font })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  return blob
}

