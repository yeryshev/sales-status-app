import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { CommentBox } from '@/widgets/CommentBox';
import { TablesBox } from '@/widgets/TablesBox';
import { PageWrapper } from '@/shared/ui/PageWrapper/PageWrapper';
import { getUserData } from '@/entities/User';
import { useLocation } from 'react-router-dom';
import { AppRoutes, RoutePath } from '@/shared/config/routeConfig/routeConfig';

const MainPage = memo(() => {
  const user = useSelector(getUserData);
  const location = useLocation();
  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];
  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const shouldSeeCommentBox = user?.isManager && userOnRightPage;

  return (
    <Layout>
      <PageWrapper>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            {shouldSeeCommentBox && (
              <Grid xs={12} sm={12} lg={2} alignSelf={'flex-start'}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <CommentBox />
                </Paper>
              </Grid>
            )}
            <Grid container xs={12} lg={shouldSeeCommentBox ? 10 : 12} spacing={2} alignSelf={'flex-start'}>
              <TablesBox />
            </Grid>
          </Grid>
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default MainPage;
