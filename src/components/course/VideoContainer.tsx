"use client";

interface VideoContainerProps {
  videoUrl: string;
}

export default function VideoContainer({ videoUrl }: VideoContainerProps) {
  return (
    <div className="w-full">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
        <iframe
          src={videoUrl}
          title="Lesson video"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        />
      </div>
    </div>
  );
}
