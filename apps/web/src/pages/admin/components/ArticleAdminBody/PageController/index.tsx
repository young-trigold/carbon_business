import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, IconButton, Stack, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../app/store';
import { setArticleCurPage as setCurPage } from '../../../../../app/store/pages/admin';

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
  curPage: number;
  pageIndex: number;
}>(({ theme, curPage, pageIndex }) => ({
  backgroundColor: curPage === pageIndex ? theme.palette.primary.main : 'unset',
  color: 'inherit',
}));

const getPageUnitFlags = (curPage: number, totalPageCount: number) => {
  if (
    [0, 1, 2, totalPageCount - 1, totalPageCount - 2, totalPageCount - 3].includes(curPage)
  ) {
    return [1, 2, 3, NaN, totalPageCount - 2, totalPageCount - 1, totalPageCount];
  }

  return [1, NaN, curPage, curPage + 1, curPage + 2, NaN, totalPageCount];
};

export const PageController = () => {
  const { curPage, totalPageCount } = useAppSelector((state) => state.adminPage.bodies.articleBody);
  const dispatch = useAppDispatch();

  const back = () => {
    if (curPage > 0) dispatch(setCurPage(curPage - 1));
  };

  const forward = () => {
    if (curPage < totalPageCount) dispatch(setCurPage(curPage + 1));
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
      <IconButton aria-label="back" onClick={back} disabled={!(curPage > 0)}>
        <ArrowBack></ArrowBack>
      </IconButton>
      {getPageUnitFlags(curPage, totalPageCount).map((pageFlag) => {
        if (Object.is(pageFlag, NaN)) return <StyledPageUnit disabled>...</StyledPageUnit>;
        return (
          <StyledFunctionalPageUnit
            key={String(pageFlag)}
            curPage={curPage}
            pageIndex={pageFlag - 1}
            onClick={() => {
              dispatch(setCurPage(pageFlag - 1));
            }}
          >
            {pageFlag}
          </StyledFunctionalPageUnit>
        );
      })}
      <IconButton
        aria-label="forward"
        onClick={forward}
        disabled={!(curPage < totalPageCount - 1)}
      >
        <ArrowForward></ArrowForward>
      </IconButton>
    </Stack>
  );
};