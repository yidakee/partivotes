import { singleChoicePolls } from './single';
import { multipleChoicePolls } from './multiple';
import { rankedChoicePolls } from './ranked';

export const pendingPolls = [
  ...singleChoicePolls,
  ...multipleChoicePolls,
  ...rankedChoicePolls
];
