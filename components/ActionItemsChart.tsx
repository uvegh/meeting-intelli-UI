'use client';

import ReactECharts from 'echarts-for-react';

interface ActionItemsChartProps {
  data: Record<string, number>;
}

export default function ActionItemsChart({ data }: ActionItemsChartProps) {
  const priorities = ['High', 'Medium', 'Low'];
  const colors = {
    High: '#ef4444',    // red
    Medium: '#f59e0b',  // orange
    Low: '#3b82f6',     // blue
  };

  const chartData = priorities.map((priority) => ({
    value: data[priority] || 0,
    name: priority,
    itemStyle: { color: colors[priority as keyof typeof colors] },
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: priorities,
    },
    series: [
      {
        name: 'Action Items',
        type: 'pie',
        radius: '60%',
        center: ['60%', '50%'],
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          formatter: '{b}: {c}',
        },
      },
    ],
  };

  return (
   
      <ReactECharts option={option} style={{ height: '300px' }} />
    
  );
}