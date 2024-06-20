import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { TablesBox } from '@/widgets/TablesBox';
import { PageWrapper } from '@/shared/ui/PageWrapper/PageWrapper';

const MainPage = memo(() => {
  return (
    <Layout>
      <PageWrapper>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid container xs={12} lg={12} spacing={2} alignSelf={'flex-start'}>
              <TablesBox />
            </Grid>
          </Grid>
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default MainPage;
