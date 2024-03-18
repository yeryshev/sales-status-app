import { StateSchema } from '@/app/providers/StoreProvider';
import { StatusBox } from '@/entities/Status';
import { Layout } from '@/widgets/Layout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { useSelector } from 'react-redux';
import { CommentsBox } from './CommentsBox/CommentsBox';
import TablesBox from './Tables/TablesBox';
import { memo } from 'react';

const Dashboard = memo(() => {
    const user = useSelector((state: StateSchema) => state.user.user);

    return (
        <Layout>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={2}>
                        {user?.firstName && user?.secondName && (
                            <Grid
                                container
                                item
                                sm={12}
                                md={3}
                                spacing={2}
                                alignSelf={'flex-start'}
                            >
                                <Grid item xs={12} sm={4} md={12} lg={12}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%'
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
                                            height: '100%'
                                        }}
                                    >
                                        <CommentsBox />
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        <Grid
                            container
                            item
                            xs={12}
                            md={user?.firstName && user?.secondName ? 9 : 12}
                            spacing={2}
                            alignSelf={'flex-start'}
                        >
                            <TablesBox />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
});

export default Dashboard;
