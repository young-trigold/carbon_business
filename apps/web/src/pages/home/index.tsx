import { Chart } from './components/Chart';
import { Stack } from '@mui/material';
import { Form } from './components/Form';
import { Header } from '../../components/Header';
import { Carousel } from './components/Carousel';
import { ArticleCard } from './components/ArticleCard';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Article } from 'lib';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export const HomePage = () => {
  const { data: articles } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await axios.get<Article[]>('/api/articles?count=10');
      return res.data;
    },
  });

  const getCarousel = async () => {
    const res = await axios.get<{
      slides: {
        backgroundImgURL: string;
        description: string;
        title: string;
        link: string;
      }[];
    }>('api/carousel');
    return res.data;
  };

  const { data: carousel } = useQuery({
    queryKey: 'carousel',
    queryFn: getCarousel,
  });

  const slides =
    carousel?.slides?.map((slide) => {
      const { title, description, backgroundImgURL, link } = slide;
      return (
        <Card
          sx={{
            position: 'relative',
          }}
          onClick={() => (window.location.href = link)}
        >
          <Box
            width="100%"
            height="400px"
            sx={{
              backgroundSize: 'cover',
              backgroundImage: `url(${window.location.protocol}//${window.location.hostname}/${backgroundImgURL})`,
            }}
          />

          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0, 0.3)',
              color: 'white',
            }}
          >
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body2">{description}</Typography>
          </CardContent>
        </Card>
      );
    }) ?? [];

  return (
    <div>
      <Header />
      <Carousel width={800} height={400} slides={slides}></Carousel>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 600px)',
          gridGap: '1em',
          justifyContent: 'space-around',
          padding: '2em',
        }}
      >
        {articles?.map((article) => (
          <ArticleCard key={article.id} {...article}></ArticleCard>
        ))}
      </Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: '1em',
        }}
      >
        <Chart width={1100} height={700} />
        <Form />
      </Stack>
    </div>
  );
};
