import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Carousel } from '../../../../components/Carousel';

interface HomeCarouselProps {
  width?: number;
  height?: number;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = (props) => {
  const { width = 900, height = 500 } = props;

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

  const { data: carousel, isLoading } = useQuery({
    queryKey: 'carousel',
    queryFn: getCarousel,
  });

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

  const slides =
    carousel?.slides?.map((slide) => {
      const { title, description, backgroundImgURL, link } = slide;
      return (
        <Card
          
          sx={{
            position: 'relative',
          }}
          onClick={() => window.open(link)}
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

  return <Carousel width={width} height={height} slides={slides} />;
};
