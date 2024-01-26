import moment from 'moment';
import { ChangeEvent, memo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { Avatar, Link, Skeleton, Switch, Tooltip } from '@mui/material';
import styles from './Row.module.scss';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../redux/store';
import { Teammate } from '../../../../types/Team';
import { updateUser } from '../../../../features/user/actions/userActions';

const statuses: Record<'online' | 'busy' | 'offline', string> = {
  online: 'онлайн',
  busy: 'занят',
  offline: 'оффлайн',
};

const Row = memo(
  ({ teammate, expanded, mango }: { teammate: Teammate; expanded: boolean; mango: boolean }) => {
    const [open, setOpen] = useState(false);
    const loading = useSelector((state: RootState) => state.team.loading);
    const updateTimeMsk = moment.utc(teammate.updatedAt).utcOffset('+0300').format('HH:mm');
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();

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

    return (
      <>
        <TableRow key={teammate.id} hover={expanded}>
          <TableCell align="left" sx={{ width: '50px' }}>
            {loading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : (
              <Avatar
                alt={`${teammate.firstName} ${teammate.secondName}`}
                src={teammate.photoUrl}
                sx={{ width: 50, height: 50 }}
                className={'' && styles['element-with-border']}
              />
            )}
          </TableCell>
          <TableCell align="left" sx={{ width: '200px' }}>
            {loading ? (
              <Skeleton variant="text" />
            ) : (
              `${teammate.firstName} ${teammate.secondName}`.slice(0, 30)
            )}
          </TableCell>
          <TableCell align="left" sx={{ width: '190px' }}>
            {loading ? (
              <Skeleton variant="text" />
            ) : (
              <Tooltip disableFocusListener title={`Последнее обновление в ${updateTimeMsk}`}>
                <div className={`${styles.status} ${styles[`status--${teammate.status}`]}`}>
                  {mango ? <a>на звонке 📞</a> : statuses[teammate.status]}{' '}
                  {teammate.isWorkingRemotely && 'удалённо'}
                </div>
              </Tooltip>
            )}
          </TableCell>
          <TableCell align="left">
            {loading ? <Skeleton variant="text" /> : teammate.comment}
          </TableCell>
          {expanded ? (
            <TableCell align="right">
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          ) : (
            <TableCell align="right">
              <Switch
                name="isWorkingRemotely"
                checked={teammate.isWorkingRemotely}
                onChange={handleSwitch}
              />
            </TableCell>
          )}
        </TableRow>
        {expanded && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Добавочный</TableCell>
                        <TableCell>Почта</TableCell>
                        <TableCell align="right">Телеграм</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={teammate.id}>
                        <TableCell>{teammate.extNumber}</TableCell>
                        <TableCell>{teammate.email}</TableCell>
                        <TableCell align="right">
                          {teammate.telegram && (
                            <Link
                              underline="none"
                              color="primary"
                              href={`http://t.me/${teammate.telegram}`}
                              target="_blank"
                            >
                              Написать
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.teammate === nextProps.teammate &&
      prevProps.expanded === nextProps.expanded &&
      prevProps.mango === nextProps.mango
    );
  }
);

export default Row;
