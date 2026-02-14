'use client';

import ReactECharts from 'echarts-for-react';

interface ActionItemsChartProps {
  data: Record<string, number>;
}

 const priorities = ['High', 'Medium', 'Low'];
  const colors = {
    High: '#ef4444',    
    Medium: '#f59e0b',  
    Low: '#3b82f6',     
  };
export default function ActionItemsChart({ data }: ActionItemsChartProps) {
 

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
      left: 'right',
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
   <div className="chart-container p-5">
      <ReactECharts option={option} style={{ height: '300px' }} />
    </div>
  );
}