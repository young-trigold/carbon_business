import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { Article } from 'lib';

const list = Array.from({ length: 5 }).map(() => ({
  title: '《生物多样性公约》第十五次缔约方大会主席、生态环境',
  subtitle:
    '2月13日，《生物多样性公约》第十五次缔约方大会（COP15）主席、生态环境部部长黄润秋以视频形式主持召开《生物多样性公约》缔约方大会主',
  date: '2020-01-21',
  source: '人民网',
  backgroundImgURL: 'imgs/carousel_01.jpg',
  link: '',
}));

const Info: React.FC<Article> = (props) => {
  const { title, subtitle, source, date, backgroundImgURL } = props;

  return (
    <Card
      sx={{
        margin: '0.5em 0',
      }}
    >
      <Stack direction="row">
        <CardMedia
          component="img"
          sx={{ width: '180px', padding: '0.5em' }}
          image={`${window.location.protocol}//${window.location.hostname}/${backgroundImgURL}`}
        />
        <CardContent sx={{ padding: '0.5em' }}>
          <Stack>
            <Typography variant="h6">{title}</Typography>
            <Stack direction="row" spacing={2}>
              <Typography variant="caption">来自：{source}</Typography>
              <Typography variant="caption">发表于：{date}</Typography>
            </Stack>
            <Typography variant="body2">{subtitle}</Typography>
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  );
};

export const InfoList = () => {
  return (
    <Box sx={{ margin: '1em 0' }}>
      <Typography variant="h5">新闻资讯</Typography>
      {list.map((data) => (
        <Info {...data}></Info>
      ))}
    </Box>
  );
};
