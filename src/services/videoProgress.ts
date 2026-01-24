import { VideoProgress } from '@/types/progress';
import { loadProgress, saveProgress } from './storage';

export function updateVideoProgress(
  lessonId: string,
  watched: number,
  total: number,
) {
  const progress = loadProgress();

  // Ensure watched time doesn't exceed total time
  const safeWatched = Math.min(watched, total);

  const existing = progress.videos.find((v) => v.lessonId === lessonId);

  if (existing) {
    existing.watchedSeconds = safeWatched;
    existing.totalSeconds = total; // Update total in case it changed
    existing.completed = safeWatched / total >= 0.95;
  } else {
    progress.videos.push({
      lessonId,
      watchedSeconds: safeWatched,
      totalSeconds: total,
      completed: safeWatched / total >= 0.95,
    });
  }

  saveProgress(progress);
}

//video completion percentage
export function videoCompletion(videos: VideoProgress[]) {
  const completed = videos.filter((v) => v.completed).length;
  return videos.length ? Math.round((completed / videos.length) * 100) : 0;
}

//bookmark a video at a specific time
export function bookmarkVideo(lessonId: string, time: number) {
  const progress = loadProgress();
  const video = progress.videos.find((v) => v.lessonId === lessonId);
  if (video) video.bookmarkedAt = time;
  saveProgress(progress);
}
