'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PriceChartProps {
  data?: Array<{ time: number; price: number }>;
  currentPrice: number;
  isPositive: boolean;
}

export default function PriceChart({ data = [], currentPrice, isPositive }: PriceChartProps) {
  // Format data for chart
  const chartData = data.map((point) => ({
    time: new Date(point.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    price: point.price,
  }));

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full h-16 flex items-center justify-center text-xs text-foreground/40 bg-muted/30 rounded">
        No price history yet
      </div>
    );
  }

  return (
    <div className="w-full h-16 -mx-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="time" hide={true} />
          <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(42, 42, 62, 0.9)',
              border: '1px solid rgba(0, 212, 170, 0.3)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => `$${value.toFixed(2)}`}
            cursor={{ stroke: 'rgba(0, 212, 170, 0.3)' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(255, 68, 68)'}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
