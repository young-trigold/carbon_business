import { Skeleton } from '@mui/material';
import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NotFoundPage from '../../pages/404';
import { HomePage } from '../../pages/home';

const ChartPage = lazy(() => import('../../pages/chart'));
const AdminPage = lazy(() => import('../../pages/admin'));
const ArticlePage = lazy(() => import('../../pages/article'));

export const RouterPart = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/chart"
          element={
            <Suspense fallback={<Skeleton />}>
              <ChartPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<Skeleton />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/articles/:articleId"
          element={
            <Suspense fallback={<Skeleton />}>
              <ArticlePage editable={false} />
            </Suspense>
          }
        />
        <Route
          path="/articles/edit/:articleId"
          element={
            <Suspense fallback={<Skeleton />}>
              <ArticlePage editable={true} />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
};
