import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useSelector } from 'react-redux';
import { type StateSchema } from '@/app/providers/StoreProvider';
import { TeamRow } from '@/entities/Team/ui/TeamRow/TeamRow';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import { Tooltip } from '@mui/material';
import { MangoRedisData, UsersTasks, UsersTickets } from '../../model/types/tasksWebsocket';
import { Teammate } from '../../model/types/teammate';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';

interface TeamTableProps {
  teamList: Teammate[];
  mango: MangoRedisData;
  tasks: UsersTasks;
  tickets: UsersTickets;
  teamIsLoading: boolean;
}

const getSkeletons = () => new Array(10)
    .fill(0)
    .map((_, index) => (
        <RowSkeleton key={index} />
    ));

export const TeamTable = memo((props: TeamTableProps) => {
    const { mango, tasks, tickets, teamIsLoading, teamList } = props;
    const userId = useSelector((state: StateSchema) => state.user.user?.id);

    const filterTeamList = ((teammate: Teammate) => {
        return teammate.secondName && teammate.firstName && teammate.id !== userId;
    });

    const renderTeamList = (teammate: Teammate) => (
        <TeamRow
            key={teammate.id}
            teammate={teammate}
            mango={mango[teammate.extNumber]}
            tasks={tasks[teammate.insideId]}
            tickets={tickets[teammate.insideId]}
            teamIsLoading={teamIsLoading}
        />
    );

    return (
        <TableContainer style={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left"></TableCell>
                        <Tooltip title={'Первичные обращения'}>
                            <TableCell align="center"><RequestQuoteOutlinedIcon fontSize={'small'} /></TableCell>
                        </Tooltip>
                        <Tooltip title={'Просроченные задачи'}>
                            <TableCell align="center"><HourglassBottomOutlinedIcon fontSize={'small'} /></TableCell>
                        </Tooltip>
                        <Tooltip title={'Количество открытых чатов'}>
                            <TableCell align="center"><QuestionAnswerOutlinedIcon fontSize={'small'}/></TableCell>
                        </Tooltip>
                        <Tooltip title={'Назначенные тикеты'}>
                            <TableCell align="center"><FeedbackOutlinedIcon fontSize={'small'}/></TableCell>
                        </Tooltip>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teamList.length > 0
                        ? teamList.filter(filterTeamList).map(renderTeamList)
                        : null}
                    {teamIsLoading && getSkeletons()}
                </TableBody>
            </Table>
        </TableContainer>
    );
});