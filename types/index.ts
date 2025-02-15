export interface User {
  id: number
  email: string
  name: string
  role: "ADMIN" | "SERVISER" | "CLIENT"
}

export interface WorkOrder {
  id: number
  number: number
  description: string
  status: "NEW" | "IN_PROGRESS" | "COMPLETED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  locationId: number
  serviserId?: number
  clientId: number
  scheduledStart?: Date
  scheduledEnd?: Date
  completedAt?: Date
  location: Location
  serviser?: User
  client: Client
}

export interface Client {
  id: number
  userId: number
  name: string
  user: User
  locations: Location[]
}

export interface Location {
  id: number
  address: string
  clientId: number
}

export interface Invoice {
  id: number
  number: number
  clientId: number
  totalAmount: number
  createdAt: Date
  dueDate: Date
  status: "UNPAID" | "PAID" | "OVERDUE"
  items: InvoiceItem[]
  client: Client
}

export interface InvoiceItem {
  id: number
  invoiceId: number
  description: string
  quantity: number
  price: number
}

