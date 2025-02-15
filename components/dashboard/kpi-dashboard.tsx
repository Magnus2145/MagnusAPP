"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface KPIData {
  totalWorkOrders: number
  completedWorkOrders: number
  averageCompletionTime: number
  revenueThisMonth: number
}

interface ChartData {
  name: string
  total: number
}

export function KPIDashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    fetchKPIData()
    fetchChartData()
  }, [])

  const fetchKPIData = async () => {
    try {
      const response = await fetch("/api/dashboard/kpi")
      if (response.ok) {
        const data = await response.json()
        setKpiData(data)
      }
    } catch (error) {
      console.error("Error fetching KPI data:", error)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/dashboard/chart")
      if (response.ok) {
        const data = await response.json()
        setChartData(data)
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
    }
  }

  if (!kpiData) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ukupno radnih naloga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.totalWorkOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Završeni radni nalozi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.completedWorkOrders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prosječno vrijeme završetka</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.averageCompletionTime.toFixed(2)} sati</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prihod ovaj mjesec</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.revenueThisMonth.toLocaleString()} kn</div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Pregled radnih naloga po mjesecima</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

