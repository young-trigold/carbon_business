import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFoundPage from '../../pages/404';
import { HomePage } from '../../pages/home';

export const RouterPart = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />

        {/* <Route
          path="/articles/:itemId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter={false} editable={false} />
            </Suspense>
          }
        /> */}
      </Routes>
    </Router>
  );
};
