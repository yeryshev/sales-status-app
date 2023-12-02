import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import StatusBox from './StatusBox/StatusBox';
import TeamTable from './TeamTable/TeamTable';
import Layout from '../../components/Layout/Layout';
import CommentsBox from './CommentsBox/CommentsBox';
import WsAlert from './StatusBox/WsAlert';

const Dashboard = () => {
  return (
    <Layout>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid container item sm={12} md={3} spacing={2}>
              <Grid item xs={12} sm={4} md={12} lg={12}>
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
              <Grid item xs={12} sm={8} md={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <CommentsBox />
                </Paper>
              </Grid>
            </Grid>

            <Grid item xs={12} md={9}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <TeamTable />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <WsAlert />
    </Layout>
  );
};

export default Dashboard;
