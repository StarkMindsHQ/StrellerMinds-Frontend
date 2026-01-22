export function generateLearningPath(
  user: { skills: { name: string; level: number }[] },
  contents: { skill: string; difficulty: number }[],
) {
  return contents.filter((content: { skill: string; difficulty: number }) =>
    user.skills.some(
      (skill: { name: string; level: number }) =>
        skill.name === content.skill &&
        content.difficulty <= Math.ceil(skill.level / 20),
    ),
  );
}
