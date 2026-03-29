import { render, screen } from "@testing-library/react";
import { FeatureFlagRenderer } from "../src/components/FeatureFlagRenderer";
import { FeatureFlagService } from "../src/services/FeatureFlagService";

jest.mock("../src/services/FeatureFlagService");

describe("FeatureFlagRenderer", () => {
  it("renders fallback when disabled", async () => {
    (FeatureFlagService.isEnabled as jest.Mock).mockResolvedValue(false);
    render(<FeatureFlagRenderer flag="test" fallback={<p>Fallback</p>}>Enabled</FeatureFlagRenderer>);
    expect(await screen.findByText("Fallback")).toBeInTheDocument();
  });

  it("renders children when enabled", async () => {
    (FeatureFlagService.isEnabled as jest.Mock).mockResolvedValue(true);
    render(<FeatureFlagRenderer flag="test">Enabled</FeatureFlagRenderer>);
    expect(await screen.findByText("Enabled")).toBeInTheDocument();
  });

  it("renders variant when provided", async () => {
    (FeatureFlagService.isEnabled as jest.Mock).mockResolvedValue(true);
    (FeatureFlagService.getVariant as jest.Mock).mockResolvedValue("A");
    render(
      <FeatureFlagRenderer flag="test" variants={{ A: <p>Variant A</p> }}>
        Default
      </FeatureFlagRenderer>
    );
    expect(await screen.findByText("Variant A")).toBeInTheDocument();
  });
});
