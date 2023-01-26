import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';
import { EChartsOption } from 'echarts';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { Alert, CircularProgress, styled } from '@mui/material';
import chartLightTheme from '../../../../app/theme/chart/light.json' assert { type: 'json' };
import chartDarkTheme from '../../../../app/theme/chart/dark.json' assert { type: 'json' };
import { useAppSelector } from '../../../../app/store';
import { CarbonBusiness, QueryKeyOfCarbonBusiness, carbonBusinessKeys } from 'types';

const ChartContainer = styled('div')(() => ({
  width: '1000px',
  height: '700px',
}));

export const Chart = () => {
  const { themeMode } = useAppSelector((state) => state.themeMode);
  const [agencies, setAgencies] = useState(['上海', '湖北', '深圳', '广州']);
  const [carbonBusinessKey, setCarbonBusinessKey] = useState<QueryKeyOfCarbonBusiness>('minPrice');

  const queryFn = async () => {
    const res = await axios.get<CarbonBusiness[]>(
      `/api/records?agencies=${agencies.toString()}&key=${carbonBusinessKey}`,
    );
    return res.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['record', ...agencies, carbonBusinessKey],
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
      xAxis: {
        name: '交易日期',
        type: 'time',
        boundaryGap: false,
      },
      yAxis: {
        name: carbonBusinessKeys.get(carbonBusinessKey),
        type: 'value',
      },
      // toolbox: {
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none',
      //     },
      //     restore: {},
      //     saveAsImage: {},
      //   },
      // },
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
      series: agencies.map((agency) => ({
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
  }, [isLoading, isError, themeMode]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{(error as AxiosError).message}</Alert>;

  return <ChartContainer ref={chartContainerRef}></ChartContainer>;
};
