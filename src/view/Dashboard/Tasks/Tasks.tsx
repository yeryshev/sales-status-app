import { Typography } from '@mui/material';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import { Box } from '@mui/system';

const Tasks = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <FormLabel id="tasks-label">Задачи на сегодня</FormLabel>
      <Typography variant="body1">Всё выполнено, можно отдохнуть 🚀</Typography>
    </Box>
  );
};

export default Tasks;
