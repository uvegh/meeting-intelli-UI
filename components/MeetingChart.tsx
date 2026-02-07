'use client';

import ReactECharts from 'echarts-for-react';
import { ChartData } from '@/lib/types';

interface MeetingChartProps {
  data: ChartData[];
}

export default function MeetingChart({ data }: MeetingChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.month),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Meetings',
    },
    series: [
      {
        name: 'Meetings',
        type: 'bar',
        data: data.map((d) => d.count),
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
}