import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Article } from 'lib';

export const ArticleCard: React.FC<Article> = (props) => {
  const { title, subtitle, source, date, backgroundImgURL, link } = props;

  const onClick = () => {
    window.open(link);
  };

  return (
    <Card
      sx={{
        height: '160px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Stack direction="row">
        <Box
          width={350}
          sx={{
            padding: '0.5em',
            backgroundImage: `url(${backgroundImgURL})`,
            backgroundSize: 'cover',
          }}
        />
        <CardContent sx={{ padding: '0.5em' }}>
          <Stack>
            <Typography variant="h6">
              {title.length > 30 ? title.slice(0, 30) + '...' : title}
            </Typography>
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
