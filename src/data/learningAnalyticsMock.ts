import {
  type DailyLearningMetric,
  type StudentLearningRecord,
} from '@/types/learningAnalytics';

const STUDENT_NAMES = [
  'Aisha Ahmed',
  'Miguel Santos',
  'Priya Patel',
  'Noah Johnson',
  'Lina Kim',
  'Mason Carter',
  'Ava Thompson',
  'Ethan Nguyen',
  'Sofia Garcia',
  'Lucas Brown',
  'Mia Wilson',
  'Elijah Moore',
  'Zara Khan',
  'Daniel Clark',
  'Grace Lee',
  'Ryan Walker',
  'Nora Davis',
  'Leo Martinez',
];

const COURSE_POOL = [
  { id: 'course-blockchain', name: 'Blockchain Fundamentals' },
  { id: 'course-defi', name: 'DeFi Fundamentals' },
  { id: 'course-stellar', name: 'Stellar Smart Contracts' },
  { id: 'course-security', name: 'Blockchain Security' },
];

const COHORT_POOL = ['2026-Q1', '2026-Q2', '2026-Q3'];

const DAY_MS = 24 * 60 * 60 * 1000;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number, precision = 2): number => {
  const scalar = Math.pow(10, precision);
  return Math.round(value * scalar) / scalar;
};

const mulberry32 = (seed: number) => {
  let current = seed;

  return () => {
    current += 0x6d2b79f5;
    let t = current;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const toIsoDay = (date: Date): string => date.toISOString().slice(0, 10);

const getTimelineAverage = (
  timeline: DailyLearningMetric[],
  selector: (point: DailyLearningMetric) => number,
): number => {
  if (timeline.length === 0) return 0;
  return round(
    timeline.reduce((sum, point) => sum + selector(point), 0) / timeline.length,
    2,
  );
};

const deriveLessonCompletions = (
  timeline: DailyLearningMetric[],
  seed: number,
): string[] => {
  const random = mulberry32(seed);
  const completions: string[] = [];

  for (const day of timeline) {
    for (let index = 0; index < day.lessonsCompleted; index += 1) {
      const completion = new Date(`${day.date}T08:00:00.000Z`);
      completion.setUTCHours(
        clamp(Math.floor(random() * 11) + 8, 8, 20),
        Math.floor(random() * 60),
        0,
        0,
      );
      completions.push(completion.toISOString());
    }
  }

  return completions.sort((left, right) => {
    return new Date(left).getTime() - new Date(right).getTime();
  });
};

const generateStudentTimeline = (
  seed: number,
  now: Date,
  days = 60,
): DailyLearningMetric[] => {
  const random = mulberry32(seed);
  const timeline: DailyLearningMetric[] = [];

  let completion = clamp(20 + random() * 25, 12, 55);
  let watchRatio = clamp(0.62 + random() * 0.18, 0.45, 1.15);
  let score = clamp(58 + random() * 18, 35, 96);

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getTime() - offset * DAY_MS);

    completion = clamp(completion + (random() * 2.8 - 0.35), 10, 100);
    watchRatio = clamp(watchRatio + (random() * 0.14 - 0.07), 0.3, 1.25);
    score = clamp(score + (random() * 6 - 2.8), 30, 100);

    const quizzesAssigned = Math.floor(random() * 3);
    const quizzesMissed =
      quizzesAssigned > 0 ? Math.floor(random() * (quizzesAssigned + 1)) : 0;
    const lessonsCompleted = Math.floor(random() * 4);
    const activeMinutes = clamp(
      Math.round(22 + watchRatio * 40 + random() * 46),
      12,
      140,
    );

    timeline.push({
      date: toIsoDay(date),
      completionRate: round(completion, 2),
      watchTimeRatio: round(watchRatio, 3),
      testScore: round(score, 2),
      quizzesAssigned,
      quizzesMissed,
      lessonsCompleted,
      activeMinutes,
    });
  }

  return timeline;
};

export const generateMockLearningRecords = (
  studentCount = 18,
  now = new Date(),
): StudentLearningRecord[] => {
  const count = clamp(studentCount, 1, STUDENT_NAMES.length);

  return Array.from({ length: count }, (_, index) => {
    const studentName = STUDENT_NAMES[index];
    const course = COURSE_POOL[index % COURSE_POOL.length];
    const cohort = COHORT_POOL[index % COHORT_POOL.length];
    const seed = 1000 + index * 17;
    const timeline = generateStudentTimeline(seed, now);
    const completionTimestamps = deriveLessonCompletions(timeline, seed + 77);
    const baselineWatchMinutes = 540 + (index % 4) * 60;
    const watchRatio = getTimelineAverage(
      timeline,
      (point) => point.watchTimeRatio,
    );
    const watchMinutes = Math.round(baselineWatchMinutes * watchRatio);
    const quizzesAssigned = timeline.reduce(
      (sum, point) => sum + point.quizzesAssigned,
      0,
    );
    const quizzesMissed = timeline.reduce(
      (sum, point) => sum + point.quizzesMissed,
      0,
    );

    const currentProgress = timeline[timeline.length - 1]?.completionRate ?? 0;
    const quizAverageScore = getTimelineAverage(
      timeline,
      (point) => point.testScore,
    );
    const lastSeenAt =
      completionTimestamps[completionTimestamps.length - 1] ??
      now.toISOString();

    return {
      studentId: `student-${index + 1}`,
      studentName,
      courseId: course.id,
      courseName: course.name,
      cohort,
      currentProgress: round(currentProgress, 2),
      baselineWatchMinutes,
      watchMinutes,
      quizAverageScore,
      quizzesAssigned,
      quizzesMissed,
      lessonCompletionTimestamps: completionTimestamps,
      timeline,
      lastSeenAt,
    };
  });
};

export const simulateLearningRecordsTick = (
  records: StudentLearningRecord[],
  now = new Date(),
): StudentLearningRecord[] => {
  if (records.length === 0) return records;

  const today = toIsoDay(now);

  return records.map((record, index) => {
    const random = mulberry32(
      now.getUTCMinutes() + now.getUTCSeconds() + index * 31,
    );
    const previousTimeline = [...record.timeline];
    const lastPoint = previousTimeline[previousTimeline.length - 1];

    if (!lastPoint) return record;

    const completionRate = clamp(
      lastPoint.completionRate + (random() * 1.4 - 0.2),
      0,
      100,
    );
    const watchTimeRatio = clamp(
      lastPoint.watchTimeRatio + (random() * 0.06 - 0.03),
      0.25,
      1.3,
    );
    const testScore = clamp(
      lastPoint.testScore + (random() * 3.5 - 1.8),
      0,
      100,
    );
    const quizzesAssigned = Math.floor(random() * 2);
    const quizzesMissed =
      quizzesAssigned > 0 ? Math.floor(random() * (quizzesAssigned + 1)) : 0;
    const lessonsCompleted = Math.floor(random() * 3);
    const activeMinutes = clamp(
      Math.round(20 + watchTimeRatio * 42 + random() * 30),
      10,
      150,
    );

    const nextPoint: DailyLearningMetric = {
      date: today,
      completionRate: round(completionRate, 2),
      watchTimeRatio: round(watchTimeRatio, 3),
      testScore: round(testScore, 2),
      quizzesAssigned,
      quizzesMissed,
      lessonsCompleted,
      activeMinutes,
    };

    const hasTodayPoint = lastPoint.date === today;
    if (hasTodayPoint) {
      previousTimeline[previousTimeline.length - 1] = nextPoint;
    } else {
      previousTimeline.push(nextPoint);
    }

    const nextTimeline = previousTimeline.slice(-60);
    const additionalCompletions = Array.from(
      { length: lessonsCompleted },
      () => {
        const completion = new Date(now);
        completion.setMinutes(Math.floor(random() * 60), 0, 0);
        return completion.toISOString();
      },
    );

    const lessonCompletionTimestamps = [
      ...record.lessonCompletionTimestamps,
      ...additionalCompletions,
    ]
      .sort((left, right) => {
        return new Date(left).getTime() - new Date(right).getTime();
      })
      .slice(-300);

    const totalAssigned = nextTimeline.reduce(
      (sum, point) => sum + point.quizzesAssigned,
      0,
    );
    const totalMissed = nextTimeline.reduce(
      (sum, point) => sum + point.quizzesMissed,
      0,
    );
    const nextWatchRatio = getTimelineAverage(
      nextTimeline,
      (point) => point.watchTimeRatio,
    );

    return {
      ...record,
      currentProgress: nextPoint.completionRate,
      watchMinutes: Math.round(record.baselineWatchMinutes * nextWatchRatio),
      quizAverageScore: getTimelineAverage(
        nextTimeline,
        (point) => point.testScore,
      ),
      quizzesAssigned: totalAssigned,
      quizzesMissed: totalMissed,
      lessonCompletionTimestamps,
      timeline: nextTimeline,
      lastSeenAt: now.toISOString(),
    };
  });
};
