import { Box, Button, ButtonGroup, Card, IconButton, Skeleton, Stack, styled } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const Dot = styled('div')<{
  index: number;
  currentIndex: number;
}>(({ theme, index, currentIndex }) => ({
  borderRadius: '50%',
  width: '8px',
  height: '8px',
  backgroundColor: index === currentIndex ? theme.palette.primary.main : 'white',
  cursor: 'pointer',
  margin: '0 16px',
}));

const SlideContainer = styled(Box)<{
  index: number;
  currentIndex: number;
}>(({ index, currentIndex, width }) => ({
  position: index === currentIndex ? 'unset' : 'absolute',
  left: 0,
  top: 0,
  opacity: index === currentIndex ? 1 : 0,
  transition: 'all 0.3s',
  color: 'white',
  transform: index === currentIndex ? 'unset' : 'translateX(200px)',
}));

interface CarouselProps {
  width: number;
  height: number;
  duration?: number;
  slides: React.ReactElement[];
  defaultIndex?: number;
}

export const Carousel: React.FC<CarouselProps> = (props) => {
  const { width, height, duration = 3000, defaultIndex = 0, slides = [] } = props;

  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  const onBack = () => {
    const { length } = slides;

    setCurrentIndex((preIndex) => {
      if (preIndex === 0) return length - 1;
      return preIndex - 1;
    });
  };

  const onForward = () => {
    const { length } = slides;

    setCurrentIndex((preIndex) => {
      if (preIndex === length - 1) return 0;
      return preIndex + 1;
    });
  };

  useEffect(() => {
    const animation = window.setInterval(onForward, duration);

    return () => {
      return window.clearInterval(animation);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        margin: '1em',
        padding: '2em',
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        {...slides.map((slide, index) => (
          <SlideContainer
            index={index}
            currentIndex={currentIndex}
            width={width - 64}
            height={height - 30}
          >
            {slide}
          </SlideContainer>
        ))}
      </div>

      <IconButton
        onClick={onBack}
        sx={{
          position: 'absolute',
          left: '0',
          top: '50%',
        }}
      >
        <ArrowBack></ArrowBack>
      </IconButton>
      <IconButton
        onClick={onForward}
        sx={{
          position: 'absolute',
          right: '0',
          top: '50%',
        }}
      >
        <ArrowForward></ArrowForward>
      </IconButton>

      <Stack
        direction="row"
        sx={{
          justifyContent: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%)',
          bottom: 0,
          marginBottom: '1em',
        }}
      >
        {Array.from({ length: slides.length }).map((_, index) => (
          <Dot
            index={index}
            currentIndex={currentIndex}
            onClick={() => setCurrentIndex(index)}
          ></Dot>
        ))}
      </Stack>
    </Box>
  );
};

export const HomeCarousel = () => {
  const getCarousel = async () => {
    const res = await axios.get<{
      slides: {
        backgroundImgURL: string;
        description: string;
        title: string;
      }[];
    }>('api/carousel');
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: 'carousel',
    queryFn: getCarousel,
  });

  const width = 900;
  const height = 500;

  if (isLoading)
    return <Skeleton width={width} height={height} variant="rounded" animation="wave" />;

  const slides =
    data?.slides?.map((slide) => {
      const { title, description, backgroundImgURL } = slide;
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundImage: `url(${window.location.protocol}//${window.location.hostname}/${backgroundImgURL})`,
            backgroundSize: 'cover',
          }}
        >
          <figcaption
            style={{
              width: '30%',
              height: '100%',
              position: 'absolute',
              right: 0,
              backgroundColor: 'rgba(0,0,0, 0.3)',
              padding: '1em',
            }}
          >
            <h1>{title}</h1>
            <p
              style={{
                textIndent: '2em',
              }}
            >
              <em>{description}</em>
            </p>
          </figcaption>
        </div>
      );
    }) ?? [];

  return <Carousel width={width} height={height} slides={slides}></Carousel>;
};
