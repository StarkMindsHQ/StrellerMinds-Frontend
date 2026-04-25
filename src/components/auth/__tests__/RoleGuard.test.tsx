import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoleGuard } from '@/components/auth/RoleGuard';

describe('RoleGuard', () => {
  it('renders children when the user has a matching role', () => {
    render(
      <RoleGuard roles="admin" user={{ role: 'admin' }}>
        <div>Admin content</div>
      </RoleGuard>,
    );

    expect(screen.getByText('Admin content')).toBeDefined();
  });

  it('renders children when the user has one of multiple allowed roles', () => {
    render(
      <RoleGuard roles={['seller', 'admin']} user={{ role: 'seller' }}>
        <span>Seller content</span>
      </RoleGuard>,
    );

    expect(screen.getByText('Seller content')).toBeDefined();
  });

  it('renders fallback when the user role is not allowed', () => {
    render(
      <RoleGuard roles={['admin', 'seller']} fallback={<p>No access</p>} user={{ role: 'user' }}>
        <div>Restricted content</div>
      </RoleGuard>,
    );

    expect(screen.getByText('No access')).toBeDefined();
    expect(screen.queryByText('Restricted content')).toBeNull();
  });

  it('renders null when user has no role and fallback is not provided', () => {
    const { container } = render(
      <RoleGuard roles="admin" user={{}}>
        <div>Hidden content</div>
      </RoleGuard>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
