import { render, screen, fireEvent } from '@testing-library/react';
import AutoSkipSilenceControls from '../AutoSkipSilenceControls';

describe('AutoSkipSilenceControls', () => {
  const defaultProps = {
    isEnabled: true,
    isDetecting: false,
    isSilent: false,
    totalSkippedTime: 0,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the toggle button', () => {
    render(<AutoSkipSilenceControls {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button', {
      name: /enable auto-skip silence/i,
    });
    
    expect(toggleButton).toBeInTheDocument();
  });

  it('should show correct icon when detection is off', () => {
    render(<AutoSkipSilenceControls {...defaultProps} isDetecting={false} />);
    
    // VolumeX icon should be present when not detecting
    const button = screen.getByRole('button');
    expect(button).toContainHTML('VolumeX');
  });

  it('should show correct icon when detection is on', () => {
    render(<AutoSkipSilenceControls {...defaultProps} isDetecting={true} />);
    
    // Volume2 icon should be present when detecting
    const button = screen.getByRole('button');
    expect(button).toContainHTML('Volume2');
  });

  it('should call onToggle when button is clicked', () => {
    render(<AutoSkipSilenceControls {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should show skipping indicator when silent', () => {
    render(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        isSilent={true}
      />
    );
    
    const skippingIndicator = screen.getByText(/skipping.../i);
    expect(skippingIndicator).toBeInTheDocument();
  });

  it('should not show skipping indicator when not silent', () => {
    render(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        isSilent={false}
      />
    );
    
    const skippingIndicator = screen.queryByText(/skipping.../i);
    expect(skippingIndicator).not.toBeInTheDocument();
  });

  it('should show time saved when totalSkippedTime > 0', () => {
    render(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        totalSkippedTime={125} // 2 minutes 5 seconds
      />
    );
    
    const timeSaved = screen.getByText(/saved: 2:05/i);
    expect(timeSaved).toBeInTheDocument();
  });

  it('should not show time saved when totalSkippedTime is 0', () => {
    render(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        totalSkippedTime={0}
      />
    );
    
    const timeSaved = screen.queryByText(/saved:/i);
    expect(timeSaved).not.toBeInTheDocument();
  });

  it('should format time correctly for various durations', () => {
    const { rerender } = render(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        totalSkippedTime={60} // 1 minute
      />
    );
    
    expect(screen.getByText(/saved: 1:00/i)).toBeInTheDocument();
    
    rerender(
      <AutoSkipSilenceControls
        {...defaultProps}
        isDetecting={true}
        totalSkippedTime={3661} // 1 hour 1 minute 1 second
      />
    );
    
    expect(screen.getByText(/saved: 61:01/i)).toBeInTheDocument();
  });

  it('should have correct accessibility labels', () => {
    const { rerender } = render(
      <AutoSkipSilenceControls {...defaultProps} isDetecting={false} />
    );
    
    expect(
      screen.getByRole('button', { name: /enable auto-skip silence/i })
    ).toBeInTheDocument();
    
    rerender(
      <AutoSkipSilenceControls {...defaultProps} isDetecting={true} />
    );
    
    expect(
      screen.getByRole('button', { name: /disable auto-skip silence/i })
    ).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <AutoSkipSilenceControls
        {...defaultProps}
        className="custom-test-class"
      />
    );
    
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass('custom-test-class');
  });

  it('should show tooltip on button hover', () => {
    render(<AutoSkipSilenceControls {...defaultProps} isDetecting={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Auto-skip silence is OFF');
    
    // Test when detecting
    render(<AutoSkipSilenceControls {...defaultProps} isDetecting={true} />);
    
    const buttonDetecting = screen.getByRole('button');
    expect(buttonDetecting).toHaveAttribute('title', 'Auto-skip silence is ON');
  });
});
