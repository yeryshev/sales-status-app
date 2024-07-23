import Container from '@mui/material/Container';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { TablesBox } from '@/widgets/TablesBox';
import { PageWrapper } from '@/shared/ui/PageWrapper';

const MainPage = memo(() => {
  return (
    <Layout>
      <PageWrapper>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <TablesBox />
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default MainPage;
