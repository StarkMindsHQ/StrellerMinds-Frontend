import { recordQuizResult } from '@/services/quizProgress';
import {
  submitAssignment,
  gradeAssignment,
} from '@/services/assignmentProgress';
import { updateVideoProgress } from '@/services/videoProgress';

export function populateTestData() {
  // Add sample quiz data
  recordQuizResult('quiz1', 85);
  recordQuizResult('quiz2', 92);
  recordQuizResult('quiz3', 78);

  // Add sample assignment data
  submitAssignment('assignment1');
  gradeAssignment('assignment1', 88, 'Good work!');
  submitAssignment('assignment2');

  // Add some video progress
  updateVideoProgress('1', 150, 300); // 50% of first video
  updateVideoProgress('2', 225, 450); // 50% of second video
}
