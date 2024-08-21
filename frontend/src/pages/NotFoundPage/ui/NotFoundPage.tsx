import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NotFoundPage() {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Box
        sx={{
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          404
        </Typography>
        <Typography component={'p'}>Страница не найдена</Typography>
        <Button type={'button'} href={'/'} variant={'contained'} color={'primary'}>
          На главную
        </Button>
      </Box>
    </Grid>
  );
}
