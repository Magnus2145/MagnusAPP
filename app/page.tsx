import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900">MagnusAPP</h1>
        <p className="mt-3 text-2xl text-gray-600">Sustav za upravljanje servisnim uslugama</p>
        <div className="flex mt-6 space-x-4">
          <Link href="/login" passHref>
            <Button size="lg">Prijava</Button>
          </Link>
        </div>
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-gray-600">© 2024 MagnusAPP. Sva prava pridržana.</p>
      </footer>
    </div>
  )
}

