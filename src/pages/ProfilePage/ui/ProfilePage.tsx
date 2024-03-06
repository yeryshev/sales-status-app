import { Layout } from '@/widgets/Layout';
import { useSelector } from 'react-redux';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { green } from '@mui/material/colors';
import { type User } from '@/entities/User/model/types/User';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { RootState, useAppDispatch } from '@/app/providers/StoreProvider';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type texstFieldType = {
    name: keyof User;
    label: string;
};

const textFields: texstFieldType[] = [
    { name: 'firstName', label: 'Имя' },
    { name: 'secondName', label: 'Фамилия' },
    { name: 'email', label: 'Email' },
    { name: 'extNumber', label: 'Добавочный номер телефона' },
    { name: 'telegram', label: 'Telegram' },
    { name: 'photoUrl', label: 'Ссылка на фото' },
];

const Profile = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<User>(user!);
    const [loading, setLoading] = useState(false);
    const timer = useRef<number>();

    const compareObjects = (user: User | null, formData: User) => {
        if (!user) {
            return false;
        }

        return (
            JSON.stringify({
                firstName: user.firstName,
                secondName: user.secondName,
                photoUrl: user.photoUrl,
                extNumber: user.extNumber,
                telegram: user.telegram,
                email: user.email,
            }) ===
            JSON.stringify({
                firstName: formData.firstName,
                secondName: formData.secondName,
                photoUrl: formData.photoUrl,
                extNumber: formData.extNumber,
                telegram: formData.telegram,
                email: formData.email,
            })
        );
    };

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        if (user) {
            dispatch(
                updateUser({
                    ...user,
                    isWorkingRemotely: e.target.checked,
                })
            );
        }
    };

    const handleUpdateAll = async () => {
        if (user) {
            dispatch(updateUser({ ...formData, id: user.id }));
        }
        setLoading(true);
        timer.current = window.setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleReset = () => {
        setFormData(user!);
    };

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
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="container">
                    <Grid container spacing={3} className="content">
                        <Grid item sm={12} md={4} lg={3} className="avatar-column">
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    justifyContent: 'center',
                                    height: '100%',
                                    marginBottom: (theme) => theme.spacing(2),
                                }}
                            >
                                <Grid
                                    container
                                    spacing={4}
                                    display={'flex'}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Grid item xs={4} sm={4} md={8} lg={10}>
                                        <Avatar
                                            src={formData.photoUrl}
                                            sx={{
                                                aspectRatio: '1/1',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                            alt={formData.firstName}
                                            className="avatar-container"
                                        />
                                    </Grid>
                                    <Grid item sm={12} md={12} lg={12} className="switch-container">
                                        <Grid
                                            container
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <span>Удаленная работа</span>
                                            </Grid>
                                            <Grid item>
                                                <Switch
                                                    color="primary"
                                                    name="isWorkingRemotely"
                                                    checked={user?.isWorkingRemotely}
                                                    onChange={handleSwitch}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item sm={12} md={8} lg={9}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Grid container spacing={2}>
                                    {textFields.map((field, index) => (
                                        <Grid key={index} item xs={12} sm={12} md={6} lg={6}>
                                            <TextField
                                                name={field.name}
                                                onChange={handleChange}
                                                label={field.label}
                                                value={
                                                    field.name in formData
                                                        ? formData[field.name]
                                                        : ''
                                                }
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                    style: { zIndex: 1 },
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box
                                    sx={{
                                        mt: 3,
                                        position: 'relative',
                                        width: '100%',
                                        display: 'flex',
                                        gap: 1,
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Button
                                        sx={{ width: '100%' }}
                                        disabled={loading || compareObjects(user, formData)}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateAll}
                                    >
                                        Сохранить
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: green[500],
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    )}
                                    <Button
                                        type="reset"
                                        sx={{ width: '100%' }}
                                        disabled={compareObjects(user, formData)}
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleReset}
                                    >
                                        Отмена
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default Profile;
