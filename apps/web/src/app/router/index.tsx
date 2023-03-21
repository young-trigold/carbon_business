import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NotFoundPage from '../../pages/404';
import { ChartPage } from '../../pages/chart';
import { HomePage } from '../../pages/home';
import { ArticlePage } from '../../pages/article';

export const RouterPart = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/article/:articleID" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
};
