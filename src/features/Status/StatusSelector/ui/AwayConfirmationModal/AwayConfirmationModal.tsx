import { type ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { AwayTimeInput } from '../AwayTimeInput/AwayTimeInput';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

export interface AwayConfirmationModalProps {
  id: string;
  open: boolean;
  onClose: (value?: number) => void;
}

export function AwayConfirmationModal(props: AwayConfirmationModalProps) {
  const { onClose, open, ...other } = props;
  const [minutes, setMinutes] = useState<number | null>(60);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(minutes || 60);
  };

  const handleChangeRadio = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setMinutes(value !== -1 ? value : null);
    setIsOtherSelected(value === -1);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth="xs" open={open} {...other}>
      <DialogTitle>Время отсутствия</DialogTitle>
      <DialogContent dividers>
        <Box display={'flex'} flexDirection={'column'} gap={1} alignItems={'stretch'}>
          <FormControl>
            <RadioGroup
              // row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={handleChangeRadio}
              value={isOtherSelected ? -1 : minutes}
            >
              <FormControlLabel value={60} control={<Radio />} label="60 минут" />
              <FormControlLabel value={30} control={<Radio />} label="30 минут" />
              <FormControlLabel value={15} control={<Radio />} label="15 минут" />
              <FormControlLabel value={-1} control={<Radio />} label="Другое" />
            </RadioGroup>
          </FormControl>
          {isOtherSelected && <AwayTimeInput value={minutes || 10} setValue={setMinutes} />}
        </Box>
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
