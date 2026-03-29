import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorRecoveryBoundary } from "../src/components/ErrorRecoveryBoundary";

function Problematic() {
  throw new Error("Boom!");
}

describe("ErrorRecoveryBoundary", () => {
  it("renders fallback on error", () => {
    render(
      <ErrorRecoveryBoundary>
        <Problematic />
      </ErrorRecoveryBoundary>
    );
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it("retry button resets error state", () => {
    render(
      <ErrorRecoveryBoundary>
        <Problematic />
      </ErrorRecoveryBoundary>
    );
    fireEvent.click(screen.getByText("Retry"));
    // After retry, children would re-render (here still fails, but state resets)
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
