import { memo } from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, Paper, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

interface FullScreenChartModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const FullScreenChartModal = memo((props: FullScreenChartModalProps) => {
  const { open, onClose, title, children } = props;
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '95vw',
          height: '95vh',
          maxWidth: 'none',
          maxHeight: 'none',
          m: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            display: 'flex',
            gap: 1,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.9)',
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            sx={{
              p: 3,
              pb: 2,
              fontWeight: 600,
              color: 'text.primary',
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flex: 1, p: 3, pt: 2, overflow: 'hidden' }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flex: 1, position: 'relative' }}>{children}</Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
});
