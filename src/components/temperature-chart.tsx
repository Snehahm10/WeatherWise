
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { DailyForecast } from './forecast-display';

interface TemperatureChartProps {
  data: DailyForecast[];
}

const chartConfig = {
  temp: {
    label: "Temperature",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = data.map(day => ({
      name: day.dayOfWeek.substring(0, 3),
      temp: day.temp,
  }));
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle>Temperature</CardTitle>
        <CardDescription>5-day temperature evolution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis 
                    dataKey="name" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                 <ChartTooltip
                    cursor={{
                        stroke: "hsl(var(--primary))",
                        strokeWidth: 1,
                        dashArray: "3 3",
                    }}
                    content={
                        <ChartTooltipContent 
                            labelClassName="text-foreground font-semibold"
                            className="bg-card/80 backdrop-blur-sm border-border/50"
                            formatter={(value, name) => [`${value}°C`, 'Avg. Temp']}
                        />
                    }
                />
                <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
