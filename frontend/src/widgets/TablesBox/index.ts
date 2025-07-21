export { TablesBox } from './ui/TablesBox';
export { useDeadlinesCheck } from './hooks/useDeadlines';
export { useTablesBoxViewModel } from './hooks/useTablesBoxViewModel';
export { matchAdditionalUserData, createSkeletons } from './lib/teamDataHelpers';

// Для CustomerCareTablesBox:
export type { TeamMember } from './ui/TeamTable/types';
export type { TeamRowCell } from './ui/TeamTable/TeamRow/TeamRowCellsList';
export { createTeamMember, filterManagers, shouldShowHeroRow, createHeroMember } from './ui/TeamTable/utils';
export { AvatarCell } from './ui/TeamTable/RowCells/AvatarCell';
export { UserNameCell } from './ui/TeamTable/RowCells/UserNameCell';
export { CommentCell as HeroCommentCell } from './ui/TeamTable/HeroRow/CommentCell';
export { CommentCell } from './ui/TeamTable/RowCells/CommentCell';
export { CELL_WIDTHS } from './ui/TeamTable/constants';
export { SeparatorRow } from './ui/TeamTable/SeparatorRow';
export { ExpandRow } from './ui/TeamTable/RowCells/ExpandRow';
export type { TeamRowProps } from './ui/TeamTable/TeamRow/TeamRow';
export { StatusCell } from './ui/TeamTable/RowCells/StatusCell';
export { ArrowDownCell } from './ui/TeamTable/RowCells/ArrowDownCell';
export type { HeroRowProps } from './ui/TeamTable/HeroRow/HeroRow';
