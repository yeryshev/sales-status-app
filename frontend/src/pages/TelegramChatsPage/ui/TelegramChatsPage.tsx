import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { PageWrapper } from '@/shared/ui/PageWrapper';
import { ChatsTable } from 'src/widgets/ChatsTable';
import { Helmet } from 'react-helmet';

const TelegramChatsPage = memo(() => {
  return (
    <Layout>
      <PageWrapper>
        <Helmet>
          <title>Рабочие чаты</title>
        </Helmet>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container>
            <ChatsTable />
          </Grid>
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default TelegramChatsPage;
