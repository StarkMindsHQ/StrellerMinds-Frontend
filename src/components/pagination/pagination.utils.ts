export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
) => {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  const range: (number | "...")[] = [];

  if (!showLeftDots && showRightDots) {
    for (let i = 1; i <= 3 + siblingCount * 2; i++) {
      range.push(i);
    }
    range.push("...");
    range.push(totalPages);
  } else if (showLeftDots && !showRightDots) {
    range.push(1);
    range.push("...");
    for (let i = totalPages - (3 + siblingCount * 2) + 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    range.push(1);
    range.push("...");
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    range.push("...");
    range.push(totalPages);
  }

  return range;
};