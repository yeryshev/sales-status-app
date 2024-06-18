import { useState } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { AwayTimeInput } from '../AwayTimeInput/AwayTimeInput';

export interface AwayConfirmationModalProps {
  id: string;
  open: boolean;
  onClose: (value?: number) => void;
}

export function AwayConfirmationModal(props: AwayConfirmationModalProps) {
  const { onClose, open, ...other } = props;
  const [minutes, setMinutes] = useState<number | null>(60);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(minutes || 60);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth="xs" open={open} {...other}>
      <DialogTitle>Время отсутствия</DialogTitle>
      <DialogContent dividers>
        <AwayTimeInput value={minutes || 60} setValue={setMinutes} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Отмена
        </Button>
        <Button onClick={handleOk}>Ок</Button>
      </DialogActions>
    </Dialog>
  );
}
