import moment from 'moment';
import { type ChangeEvent, memo, useState } from 'react';
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
import { Avatar, Chip, Link, Skeleton, Switch, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { Teammate } from '@/entities/Teammate';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { OverridableStringUnion } from '@mui/types';
import { ChipPropsColorOverrides } from '@mui/material/Chip';
import PhoneIcon from '@mui/icons-material/Phone';

const statuses: Record<'online' | 'busy' | 'offline', 'онлайн' | 'занят' | 'оффлайн'> = {
    online: 'онлайн',
    busy: 'занят',
    offline: 'оффлайн',
};

const StatusColors: Record<
  'online' | 'busy' | 'offline',
  OverridableStringUnion<
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  ChipPropsColorOverrides
  >> = {
      'online': 'success',
      'busy': 'primary',
      'offline': 'default',
  };

const Row = memo(
    ({ teammate, expanded, mango }: { teammate: Teammate; expanded: boolean; mango: boolean }) => {
        const [expandRow, setExpandRow] = useState(false);
        const loading = useSelector((state: StateSchema) => state.team.loading);
        const user = useSelector((state: StateSchema) => state.user.user);
        const dispatch = useAppDispatch();
        const updateTimeMsk = moment.utc(teammate.updatedAt).utcOffset('+0300').format('HH:mm');

        const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
            if (user) {
                dispatch(
                    updateUser({
                        ...user,
                        isWorkingRemotely: e.target.checked,
                    }),
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
                            <Tooltip
                                disableFocusListener
                                title={`Последнее обновление в ${updateTimeMsk}`}
                            >
                                <Chip
                                    label={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {
                                                mango ?
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                        }}>
                                                        <PhoneIcon /> на звонке
                                                    </div> : statuses[teammate.status]
                                            }
                                            {' '}
                                            {teammate.isWorkingRemotely && 'удалённо'}
                                        </div>
                                    }
                                    color={StatusColors[teammate.status]}
                                />
                            </Tooltip>

                        )}
                    </TableCell>
                    <TableCell align="left">
                        {loading ? <Skeleton variant="text" /> : teammate.comment}
                    </TableCell>
                    {expanded ? (
                        <TableCell align="right">
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => {
                                    setExpandRow(!expandRow);
                                }}
                            >
                                {expandRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                            <Collapse in={expandRow} timeout="auto" unmountOnExit>
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
    },
);

export default Row;
