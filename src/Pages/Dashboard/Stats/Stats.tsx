import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const Stats = (): JSX.Element => {
  const team = useSelector((state: RootState) => state.team.list);

  return (
    <React.Fragment>
      <FormLabel id="stats-label">Статистика</FormLabel>
      <List sx={{ width: '100%', maxWidth: 360 }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccessibilityNewIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Онлайн"
            secondary={team.filter((t) => t.status === 'online').length}
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <DoNotDisturbIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Заняты"
            secondary={team.filter((t) => t.status === 'busy').length}
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NoAccountsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Недоступны"
            secondary={team.filter((t) => t.status === 'offline').length}
          />
        </ListItem>
      </List>
    </React.Fragment>
  );
};

export default Stats;
