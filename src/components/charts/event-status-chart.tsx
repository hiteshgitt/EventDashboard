import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Event } from "../../types/event";
import { Spinner } from "@heroui/react";

interface EventStatusChartProps {
  events: Event[];
}

export const EventStatusChart: React.FC<EventStatusChartProps> = ({ events }) => {
  // Process data for the chart
  const statusCounts = React.useMemo(() => {
    const counts = {
      published: 0,
      draft: 0,
      cancelled: 0,
      completed: 0
    };
    
    events.forEach(event => {
      if (counts.hasOwnProperty(event.status)) {
        counts[event.status as keyof typeof counts]++;
      }
    });
    
    return Object.entries(counts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  }, [events]);

  const COLORS = ['#17c964', '#006FEE', '#f31260', '#f5a524'];

  if (!events.length) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusCounts}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {statusCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} events`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--heroui-content1))',
              border: '1px solid hsl(var(--heroui-divider))',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};