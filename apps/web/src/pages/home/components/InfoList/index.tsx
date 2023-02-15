import { Box, Divider, Stack, Typography } from '@mui/material';

const list = Array.from({ length: 5 }).map(() => ({
  title: '《生物多样性公约》第十五次缔约方大会主席、生态环境',
  subtitle:
    '2月13日，《生物多样性公约》第十五次缔约方大会（COP15）主席、生态环境部部长黄润秋以视频形式主持召开《生物多样性公约》缔约方大会主',
  date: '2020-01-21',
  source: '人民网',
  backgroundImgURL: 'imgs/carousel_01.jpg',
}));

const Info: React.FC<{
  title: string;
  subtitle: string;
  source: string;
  date: string;
  backgroundImgURL: string;
}> = (props) => {
  const { title, subtitle, source, date, backgroundImgURL } = props;

  return (
    <Box sx={{ margin: '1em 0' }}>
      <Stack direction="row">
        <Box
          width={400}
          sx={{
            borderRadius: '4px',
            marginRight: '1em',
            backgroundSize: 'cover',
            backgroundImage: `url(${window.location.protocol}//${window.location.hostname}/${backgroundImgURL})`,
          }}
        ></Box>
        <Box>
          <Stack>
            <Typography variant="h6">{title}</Typography>
            <Stack direction="row" spacing={2}>
              <Typography variant="caption">来自：{source}</Typography>
              <Typography variant="caption">发表于：{date}</Typography>
            </Stack>
            <Typography variant="body2">{subtitle}</Typography>
          </Stack>
        </Box>
      </Stack>
      <Divider></Divider>
    </Box>
  );
};

export const InfoList = () => {
  return (
    <Box>
      <Typography variant="h5">新闻资讯</Typography>
      {list.map((data) => (
        <Info {...data}></Info>
      ))}
    </Box>
  );
};
