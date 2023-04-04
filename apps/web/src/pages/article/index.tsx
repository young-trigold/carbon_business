import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { useQuery } from 'react-query';

export const ArticlePage: React.FC = () => {
  const { articleId } = useParams();
  console.debug(articleId);
  // const {} = useQuery({
    
  // });

  return (
    <Box>
      <Header />
      <main>
        
      </main>
    </Box>
  );
};
