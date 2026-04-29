import { SubtitleTrack } from '@/components/VideoPlayerSync';

export type LessonVideoPlayerProps = {
  src: string;
  lessonId: string; // used for saving progress
  autoPlay?: boolean;
  subtitleTracks?: SubtitleTrack[];
};
