import { activePolls } from './active';
import { endedPolls } from './ended';
import { pendingPolls } from './pending';

export const mockPolls = [
  ...activePolls,
  ...endedPolls,
  ...pendingPolls
];
