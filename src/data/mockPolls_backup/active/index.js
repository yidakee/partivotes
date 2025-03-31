import { singleChoicePolls } from './single';
import { multipleChoicePolls } from './multiple';
import { rankedChoicePolls } from './ranked';

export const activePolls = [
  ...singleChoicePolls,
  ...multipleChoicePolls,
  ...rankedChoicePolls
];
