// CustomerCarePage — страница для customer care (isCcManager)
import Container from '@mui/material/Container';
import { Layout } from '@/widgets/Layout';
import { memo } from 'react';
import { CustomerCareTablesBox } from '@/widgets/CustomerCareTablesBox';
import { PageWrapper } from '@/shared/ui/PageWrapper';

const CustomerCarePage = memo(() => {
  return (
    <Layout>
      <PageWrapper data-testid={'customer-care-page'}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <CustomerCareTablesBox />
        </Container>
      </PageWrapper>
    </Layout>
  );
});

export default CustomerCarePage;
