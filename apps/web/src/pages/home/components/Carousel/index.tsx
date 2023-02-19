import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  styled,
} from '@mui/material';
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
}>(({ index, currentIndex }) => ({
  borderRadius: '4px',
  position: index === currentIndex ? 'unset' : 'absolute',
  opacity: index === currentIndex ? 1 : 0,
  transition: 'all 0.3s',
  color: 'white',
  transform: index === currentIndex ? 'unset' : 'translateX(-50%)'
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
        width: '900px',
        height: '500px',
        padding: '0 2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 1em',
      }}
    >
      {...slides.map((slide, index) => (
        <SlideContainer index={index} currentIndex={currentIndex} width={width} height={height}>
          {slide}
        </SlideContainer>
      ))}

      <IconButton
        onClick={onBack}
        sx={{
          position: 'absolute',
          left: '0',
         
        }}
        color="primary"
      >
        <ArrowBack></ArrowBack>
      </IconButton>
      <IconButton
        onClick={onForward}
        sx={{
          position: 'absolute',
          right: '0',
        }}
        color="primary"
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
