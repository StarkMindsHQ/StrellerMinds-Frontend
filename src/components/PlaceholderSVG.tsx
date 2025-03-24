// This is a placeholder image for when the image link for a card is not accessible

interface PlaceholderSVGProps {
    className?: string
  }
  
  export function PlaceholderSVG({ className = "h-20 w-20" }: PlaceholderSVGProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className={className}
      >
        <rect width="80" height="80" rx="8" fill="#E5E7EB" />
        <path
          d="M40 20C28.954 20 20 28.954 20 40C20 51.046 28.954 60 40 60C51.046 60 60 51.046 60 40C60 28.954 51.046 20 40 20ZM40 24C42.125 24 43.846 25.721 43.846 27.846C43.846 29.971 42.125 31.692 40 31.692C37.875 31.692 36.154 29.971 36.154 27.846C36.154 25.721 37.875 24 40 24ZM48 52H32C31.448 52 31 51.552 31 51C31 50.448 31.448 50 32 50H34V38H32C31.448 38 31 37.552 31 37C31 36.448 31.448 36 32 36H42C42.552 36 43 36.448 43 37V50H48C48.552 50 49 50.448 49 51C49 51.552 48.552 52 48 52ZM41 38H36V50H41V38Z"
          fill="#9CA3AF"
        />
      </svg>
    )
  }
  
  