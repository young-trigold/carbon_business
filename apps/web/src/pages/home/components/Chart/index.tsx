import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { EChartsOption } from 'echarts';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { Alert, Box, Skeleton } from '@mui/material';
import chartLightTheme from '../../../../app/theme/chart/light.json' assert { type: 'json' };
import chartDarkTheme from '../../../../app/theme/chart/dark.json' assert { type: 'json' };
import { useAppSelector } from '../../../../app/store';
import { CarbonBusiness, carbonBusinessKeys, formatNumber } from 'types';

export const Chart = () => {
  const { themeMode } = useAppSelector((state) => state.themeMode);
  const { startDate, endDate, checkedAgencies, queryKey } = useAppSelector(
    (state) => state.homePage,
  );

  const queryFn = async () => {
    const res = await axios.get<CarbonBusiness[]>(
      `/api/records?checkedAgencies=${checkedAgencies.toString()}&key=${queryKey}&startDate=${startDate}&endDate=${endDate}`,
    );
    return res.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['record', ...checkedAgencies, queryKey, startDate, endDate],
    queryFn,
  });

  const chartContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isLoading || isError) return;
    echarts.registerTheme('light', chartLightTheme);
    echarts.registerTheme('dark', chartDarkTheme);
    const chart = echarts.init(chartContainerRef.current!, themeMode, {
      renderer: 'svg',
    });
    const option: EChartsOption = {
      grid: {
        left: 75,
        top: 40,
        right: 15,
        bottom: 70,
      },
      xAxis: {
        type: 'time',
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [8, 16],
        },
        axisTick: {
          inside: true,
        },
        minorTick: {
          show: true,
        },
        axisPointer: {
          show: true,
          label: {
            color: 'blue',
          },
        },
      },
      yAxis: {
        name: carbonBusinessKeys.get(queryKey),
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            if (queryKey.toLowerCase().includes('price')) return `${formatNumber(value)}元/吨`;
            if (queryKey === 'amount') return `${formatNumber(value)}元`;
            if (queryKey === 'volume') return `${formatNumber(value)}吨`;
            return `${value}`;
          },
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [8, 16],
        },
        axisTick: {
          inside: true,
        },
        minorTick: {
          show: true,
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
      series: checkedAgencies.map((agency) => ({
        type: 'line',
        dimensions: ['date', agency],
        name: agency,
        connectNulls: true, // 连接 null 值
        showSymbol: false, // 去掉圆圈
        smooth: true, // 光滑曲线
      })),
      legend: {
        orient: 'horizontal',
      },
    };
    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [isLoading, isError, themeMode, ...checkedAgencies, queryKey, startDate, endDate]);

  if (isLoading) return <Skeleton variant="rounded" animation="wave" width={1000} height={700} />;
  if (isError) return <Alert severity="error">{(error as AxiosError).message}</Alert>;

  return <Box ref={chartContainerRef} width={1100} height={700} minWidth={1100}></Box>;
};
