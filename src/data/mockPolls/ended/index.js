import { singleChoicePolls } from './single';
import { multipleChoicePolls } from './multiple';
import { rankedChoicePolls } from './ranked';

export const endedPolls = [
  ...singleChoicePolls,
  ...multipleChoicePolls,
  ...rankedChoicePolls
];
