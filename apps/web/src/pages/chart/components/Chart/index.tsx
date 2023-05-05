import { Alert, Box, Skeleton } from '@mui/material';
import axios, { AxiosError } from 'axios';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { carbonBusinessKeys, formatNumber } from 'lib';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useAppSelector } from '../../../../app/store';
import chartDarkTheme from '../../../../app/theme/chart/dark.json' assert { type: 'json' };
import chartLightTheme from '../../../../app/theme/chart/light.json' assert { type: 'json' };

interface ChartProps {
  width: number;
  height: number;
}

const colorConfig = {
  上海: '#dd6b66',
  湖北: '#759aa0',
  深圳: '#e69d87',
  广州: '#8dc1a9',
  全国: '#ea7e53',
  北京: '#eedd78',
  重庆: '#73a373',
  天津: '#73b9bc',
  海峡: '#7289ab',
};

export const Chart: React.FC<ChartProps> = (props) => {
  const { width, height } = props;
  const { themeMode } = useAppSelector((state) => state.themeMode);
  const { startDate, endDate, checkedAgencies, queryKey } = useAppSelector(
    (state) => state.chartPage,
  );

  const queryFn = async () => {
    const res = await axios.get<Array<{ date: string }>>(
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
        top: 76,
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
      dataset: [
        {
          source: data!.slice(1558 / 2 + 1),
        },
        {
          source: data!.slice(0, 1558 / 2 + 1).map((record) => {
            const obj: Record<string, string> = {};
            Object.entries(record).forEach(([key, value]) => {
              if (key === 'date') obj.date = value;
              else obj[`${key}预测`] = value;
            });
            return obj;
          }),
        },
      ],
      series: [
        ...checkedAgencies.map((agency) => ({
          type: 'line',
          dimensions: ['date', agency],
          name: agency,
          connectNulls: true, // 连接 null 值
          showSymbol: false, // 去掉圆圈
          smooth: true, // 光滑曲线
          datasetIndex: 0,
          lineStyle: { color: colorConfig[agency]},
          itemStyle: {color: colorConfig[agency]}
        })),
        ...checkedAgencies.map((agency) => ({
          type: 'line',
          dimensions: ['date', `${agency}预测`],
          name: `${agency}预测`,
          connectNulls: true, // 连接 null 值
          showSymbol: false, // 去掉圆圈
          smooth: true, // 光滑曲线
          datasetIndex: 1,
          lineStyle: { type: 'dotted', color: colorConfig[agency] },
          itemStyle: {color: colorConfig[agency]},
        })),
      ] as any,
      legend: {
        orient: 'horizontal',
        top: 8,
      },
    };
    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [isLoading, isError, themeMode, checkedAgencies, queryKey, startDate, endDate]);

  if (isLoading)
    return (
      <Skeleton
        variant="rounded"
        animation="wave"
        width={width}
        height={height}
        sx={{
          minWidth: width,
        }}
      />
    );
  if (isError) return <Alert severity="error">{(error as AxiosError).message}</Alert>;

  return <Box ref={chartContainerRef} width={width} height={height} minWidth={width}></Box>;
};
