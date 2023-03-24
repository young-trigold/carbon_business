import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, IconButton, Stack, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { setArticleCurPage } from '../../../../app/store/pages/home';

const StyledPageUnit = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  border: `1px solid ${theme.palette.primary.main}`,
  padding: 0,
  margin: '1em',
  minWidth: 'unset',
}));

const StyledFunctionalPageUnit = styled(StyledPageUnit)<{
  articleCurPage: number;
  pageIndex: number;
}>(({ theme, articleCurPage, pageIndex }) => ({
  backgroundColor: articleCurPage === pageIndex ? theme.palette.primary.main : 'unset',
  color: 'inherit',
}));

const getPageUnitFlags = (articleCurPage: number, totalPageCount: number) => {
  if (
    [0, 1, 2, totalPageCount - 1, totalPageCount - 2, totalPageCount - 3].includes(articleCurPage)
  ) {
    return [1, 2, 3, NaN, totalPageCount - 2, totalPageCount - 1, totalPageCount];
  }

  return [1, NaN, articleCurPage, articleCurPage + 1, articleCurPage + 2, NaN, totalPageCount];
};

export const PageController = () => {
  const { articleCurPage, totalPageCount } = useAppSelector((state) => state.homePage);
  const dispatch = useAppDispatch();

  const back = () => {
    if (articleCurPage > 0) dispatch(setArticleCurPage(articleCurPage - 1));
  };

  const forward = () => {
    if (articleCurPage < totalPageCount) dispatch(setArticleCurPage(articleCurPage + 1));
  };

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        margin: '1em 0',
      }}
    >
      <IconButton aria-label="back" onClick={back} disabled={!(articleCurPage > 0)}>
        <ArrowBack></ArrowBack>
      </IconButton>
      {getPageUnitFlags(articleCurPage, totalPageCount).map((pageFlag) => {
        if (Object.is(pageFlag, NaN)) return <StyledPageUnit disabled>...</StyledPageUnit>;
        return (
          <StyledFunctionalPageUnit
            key={String(pageFlag)}
            articleCurPage={articleCurPage}
            pageIndex={pageFlag - 1}
            onClick={() => {
              dispatch(setArticleCurPage(pageFlag - 1));
            }}
          >
            {pageFlag}
          </StyledFunctionalPageUnit>
        );
      })}
      <IconButton
        aria-label="forward"
        onClick={forward}
        disabled={!(articleCurPage < totalPageCount - 1)}
      >
        <ArrowForward></ArrowForward>
      </IconButton>
    </Stack>
  );
};
