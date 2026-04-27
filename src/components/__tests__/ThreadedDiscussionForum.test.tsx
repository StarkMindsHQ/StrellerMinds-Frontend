import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThreadedDiscussionForum } from '@/components/cms/ThreadedDiscussionForum';

const { roleState } = vi.hoisted(() => ({
  roleState: { value: 'admin' as string | undefined },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: roleState.value ? { role: roleState.value } : null,
    role: roleState.value,
    permissions: [],
    isAuthenticated: Boolean(roleState.value),
    isLoading: false,
  }),
}));

describe('ThreadedDiscussionForum', () => {
  beforeEach(() => {
    roleState.value = 'admin';
  });

  it('shows pin controls for admin users', () => {
    render(<ThreadedDiscussionForum />);

    expect(
      screen.getAllByRole('button', { name: 'Pin' }).length,
    ).toBeGreaterThan(0);
  });

  it('hides pin controls for non-admin users', () => {
    roleState.value = 'student';

    render(<ThreadedDiscussionForum />);

    expect(screen.queryByRole('button', { name: 'Pin' })).toBeNull();
  });

  it('pins and unpins a root thread in the pinned section', () => {
    render(<ThreadedDiscussionForum />);

    expect(screen.queryByText('Pinned discussions')).toBeNull();

    fireEvent.click(screen.getAllByRole('button', { name: 'Pin' })[0]);

    expect(screen.getByText('Pinned discussions')).toBeDefined();
    expect(
      screen.getAllByText(/How are you all structuring the drag-and-drop quiz experience/i),
    ).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Unpin' }));

    expect(screen.queryByText('Pinned discussions')).toBeNull();
  });
});
