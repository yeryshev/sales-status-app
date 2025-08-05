import { useState } from 'react';

export type DisplayMode = 'absolute' | 'percentage';

export const useChartDisplayMode = () => {
  const [successByChannelMode, setSuccessByChannelMode] = useState<DisplayMode>('absolute');
  const [successByTypeMode, setSuccessByTypeMode] = useState<DisplayMode>('absolute');
  const [departmentPlanMode, setDepartmentPlanMode] = useState<DisplayMode>('absolute');
  const [includeForecast, setIncludeForecast] = useState<boolean>(false);

  return {
    successByChannelMode,
    setSuccessByChannelMode,
    successByTypeMode,
    setSuccessByTypeMode,
    departmentPlanMode,
    setDepartmentPlanMode,
    includeForecast,
    setIncludeForecast,
  };
};
