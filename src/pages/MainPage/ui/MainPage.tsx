import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { StateSchema } from '@/app/providers/StoreProvider';
import { StatusBox } from '@/entities/Status';
import { Layout } from '@/widgets/Layout';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CommentsBox } from '@/widgets/CommentsBox';
import { TablesBox } from '@/entities/Table';
import { useSocketCtx } from '@/app/providers/WsProvider';
import { SocketCtxState } from '@/app/providers/WsProvider/lib/WsContext';

const handleVisibilityChange = (websockets: SocketCtxState) => {
    if (!document.hidden) {

        const isOpen = WebSocket.OPEN;

        for (const socket of websockets) {
            if (socket?.readyState !== isOpen) {
                window.location.reload();
            }
        }
    }
};

const MainPage = memo(() => {
    const websockets = useSocketCtx();
    const user = useSelector((state: StateSchema) => state.user.user);

    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            handleVisibilityChange(websockets);
        });

        return () => {
            document.removeEventListener('visibilitychange', () => {
                handleVisibilityChange(websockets);
            });
        };
    }, [websockets]);

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
                    overflow: 'auto',
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
                                lg={2}
                                spacing={2}
                                alignSelf={'flex-start'}
                            >
                                <Grid item xs={12} sm={4} lg={12}>
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
                                <Grid item xs={12} sm={8} lg={12}>
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
                        )}

                        <Grid
                            container
                            item
                            xs={12}
                            lg={user?.firstName && user?.secondName ? 10 : 12}
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

export default MainPage;
