import { ArrowBack, ArrowForward } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

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

const SlideContainer = styled(Card)<{
  index: number;
  currentindex: number;
}>(({ index, currentindex }) => ({
  borderRadius: '4px',
  position: index === currentindex ? 'relative' : 'absolute',
  opacity: index === currentindex ? 1 : 0,
  transition: 'all 0.3s',
  color: 'white',
  transform: index === currentindex ? 'unset' : 'translateX(-50%)',
  cursor: "pointer",
}));

interface HomeCarouselProps {
  width?: number;
  height?: number;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = (props) => {
  const { width = 900, height = 500 } = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSlides = async () => {
    const res = await axios.get<
      {
        backgroundImgURL: string;
        description: string;
        title: string;
        link: string;
        id: string;
      }[]
    >('api/slides');
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['slides'],
    queryFn: getSlides,
  });

  const slides =
    data?.map((slide, index) => {
      const { title, description, backgroundImgURL, link, id } = slide;
      return (
        <SlideContainer
          key={id}
          index={index}
          currentindex={currentIndex}
          onClick={() => window.open(link)}
        >
          <Box
            width="800px"
            height="400px"
            sx={{
              backgroundSize: 'cover',
              backgroundImage: `url(${location.protocol}//${location.host}/${backgroundImgURL})`,
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
        </SlideContainer>
      );
    }) ?? [];

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
    const animation = window.setInterval(onForward, 3000);

    return () => {
      return window.clearInterval(animation);
    };
  }, [onForward]);

  const theme = useTheme();

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

  return (
    <Box
      sx={{
        position: 'relative',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0,
      }}
    >
      {...slides}

      <IconButton
        onClick={onBack}
        sx={{
          position: 'absolute',
          left: '0',
          transform: 'translate(100%)',
          border: `1px solid ${theme.palette.primary.main}`,
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
          transform: 'translate(-100%)',
          border: `1px solid ${theme.palette.primary.main}`,
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
