import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AwayTimeInput } from '../../ui/AwayTimeInput/AwayTimeInput';

const options = ['15 минут', '1 час', 'Другое'];

export interface AwayConfirmationModalProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export function AwayConfirmationModal(props: AwayConfirmationModalProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Время отсутствия</DialogTitle>
      <DialogContent dividers>
        <RadioGroup ref={radioGroupRef} aria-label="ringtone" name="ringtone" value={value} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel value={option} key={option} control={<Radio />} label={option} />
          ))}
          <AwayTimeInput />
        </RadioGroup>
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

export default function ConfirmationDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="div" role="group">
        <ListItemButton divider disabled>
          <ListItemText primary="Interruptions" />
        </ListItemButton>
        <ListItemButton
          divider
          aria-haspopup="true"
          aria-controls="ringtone-menu"
          aria-label="phone ringtone"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Phone ringtone" secondary={value} />
        </ListItemButton>
        <ListItemButton divider disabled>
          <ListItemText primary="Default notification ringtone" secondary="Tethys" />
        </ListItemButton>
        <AwayConfirmationModal id="ringtone-menu" keepMounted open={open} onClose={handleClose} value={value} />
      </List>
    </Box>
  );
}
