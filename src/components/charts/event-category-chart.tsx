import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Event } from "../../types/event";
import { Spinner } from "@heroui/react";

interface EventCategoryChartProps {
  events: Event[];
}

export const EventCategoryChart: React.FC<EventCategoryChartProps> = ({ events }) => {
  // Process data for the chart
  const categoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    
    events.forEach(event => {
      if (categories[event.category]) {
        categories[event.category]++;
      } else {
        categories[event.category] = 1;
      }
    });
    
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Show top 6 categories
  }, [events]);

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
        <BarChart
          data={categoryData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: 'hsl(var(--heroui-divider))' }}
            tickLine={false}
          />
          <YAxis 
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} events`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--heroui-content1))',
              border: '1px solid hsl(var(--heroui-divider))',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--heroui-primary-500))" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};