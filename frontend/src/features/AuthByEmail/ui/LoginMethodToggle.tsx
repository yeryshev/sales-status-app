import { Button, Box } from '@mui/material';
import { memo } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';

interface LoginMethodToggleProps {
  onToggle: (showEmailForm: boolean) => void;
  showEmailForm: boolean;
}

export const LoginMethodToggle = memo(({ onToggle, showEmailForm }: LoginMethodToggleProps) => {
  return (
    <Box sx={{ mb: 2 }}>
      {!showEmailForm ? (
        <Button fullWidth variant="outlined" startIcon={<PersonIcon />} onClick={() => onToggle(true)} sx={{ mb: 1 }}>
          Войти по логину и паролю
        </Button>
      ) : (
        <Button fullWidth variant="text" startIcon={<LoginIcon />} onClick={() => onToggle(false)} sx={{ mb: 1 }}>
          Вернуться к SSO
        </Button>
      )}
    </Box>
  );
});
