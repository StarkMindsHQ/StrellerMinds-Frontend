import { loadProgress, saveProgress } from './storage';

export function submitAssignment(assignmentId: string) {
  const progress = loadProgress();

  const assignment = progress.assignments.find(
    (a) => a.assignmentId === assignmentId,
  );

  if (!assignment) {
    progress.assignments.push({
      assignmentId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
  } else {
    assignment.status = 'submitted';
    assignment.submittedAt = new Date().toISOString();
  }

  saveProgress(progress);
}

//Backend sync
export function gradeAssignment(
  assignmentId: string,
  grade: number,
  feedback: string,
) {
  const progress = loadProgress();
  const assignment = progress.assignments.find(
    (a) => a.assignmentId === assignmentId,
  );

  if (assignment) {
    assignment.status = 'graded';
    assignment.grade = grade;
    assignment.feedback = feedback;
  }

  saveProgress(progress);
}
