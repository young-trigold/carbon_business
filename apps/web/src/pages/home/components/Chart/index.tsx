import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { EChartsOption } from 'echarts';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CarbonBusiness } from 'types';

const ChartContainer = styled.div({
  width: 1000,
  height: 700,
});

const queryFn = async () => {
  return await axios.get<CarbonBusiness[]>('/api/records');
};

export const Chart = () => {
  const {isLoading, isError, error, data } = useQuery({
    queryKey: ['record'],
    queryFn,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chart = echarts.init(chartContainerRef.current!, undefined, {
      renderer: 'svg',
    });
    const option: EChartsOption = {
      xAxis: {
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
      },
      dataset: {
        source: [
          { date: '2017-10-31', first: 43.3, second: 85.8 },
          { date: '2017-11-30', first: 83.1, second: 73.4 },
          { date: '2017-12-31', first: 86.4, second: 65.2 },
          { date: '2018-01-31', first: 72.4, second: 53.9 },
        ],
      },
      series: [
        {
          type: 'line',
          dimensions: ['date', 'first'],
        },
        {
          type: 'line',
          dimensions: ['date', 'second'],
        },
      ],
      dataZoom: [
        {
          type: 'inside',
        },
      ],
    };
    chart.setOption(option);
  }, []);

  if(isLoading) return 'loading';
  if(isError) return 'error';

  return <ChartContainer ref={chartContainerRef}></ChartContainer>;
};
