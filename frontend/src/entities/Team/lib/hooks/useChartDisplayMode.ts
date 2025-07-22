import { useState } from 'react';

export type DisplayMode = 'absolute' | 'percentage';

export const useChartDisplayMode = () => {
  const [successByChannelMode, setSuccessByChannelMode] = useState<DisplayMode>('absolute');
  const [successByTypeMode, setSuccessByTypeMode] = useState<DisplayMode>('absolute');

  return {
    successByChannelMode,
    setSuccessByChannelMode,
    successByTypeMode,
    setSuccessByTypeMode,
  };
};
