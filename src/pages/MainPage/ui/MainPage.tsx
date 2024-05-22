import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { StatusBox } from '@/entities/Status';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { CommentBox } from '@/widgets/CommentBox';
import { TablesBox } from '@/widgets/TablesBox';
import { PageWrapper } from '@/shared/ui/PageWrapper/PageWrapper';
import { getUserData } from '@/entities/User';

const MainPage = memo(() => {
  const user = useSelector(getUserData);

  return (
    <Layout>
      <PageWrapper>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            {user?.firstName && user?.secondName && (
              <Grid container sm={12} lg={2} spacing={2} alignSelf={'flex-start'}>
                <Grid xs={12} sm={4} lg={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <StatusBox />
                  </Paper>
                </Grid>
                <Grid xs={12} sm={8} lg={12}>
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
              </Grid>
            )}

            <Grid
              container
              xs={12}
              lg={user?.firstName && user?.secondName ? 10 : 12}
              spacing={2}
              alignSelf={'flex-start'}
            >
              <TablesBox />
            </Grid>
          </Grid>
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default MainPage;
