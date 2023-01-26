import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { EChartsOption } from 'echarts';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { CarbonBusiness } from 'types';
import { Alert, CircularProgress } from '@mui/material';

const ChartContainer = styled.div({
  width: 1200,
  height: 700,
});

const queryFn = async () => {
  const res = await axios.get<CarbonBusiness[]>('/api/records');
  return res.data;
};

export const Chart = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['record'],
    queryFn,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isLoading || isError) return;
    const chart = echarts.init(chartContainerRef.current!, undefined, {
      renderer: 'svg',
    });
    const option: EChartsOption = {
      xAxis: {
        name: '交易时间',
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        name: '成交均价',
        type: 'value',
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20,
        },
        {
          start: 0,
          end: 20,
        },
      ],
      dataset: {
        source: data!,
      },
      series: ['上海', '湖北', '深圳', '广州'].map((agency) => ({
        type: 'line',
        dimensions: ['date', agency],
        name: agency,
        connectNulls: true, // 连接 null 值
        showSymbol: false, // 去掉圆圈
        smooth: true, // 光滑曲线
      })),
    };
    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [isLoading, isError]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{(error as AxiosError).message}</Alert>;

  return <ChartContainer ref={chartContainerRef}></ChartContainer>;
};
