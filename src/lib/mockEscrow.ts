export type Role = 'creator' | 'contributor';

export type Milestone = {
  id: string;
  title: string;
  amount: number; // goal for milestone
  fundedAmount: number; // amount currently funded toward this milestone
  status: 'PENDING' | 'FUNDED' | 'RELEASED';
  dueDate?: string;
};

export type EscrowState = {
  id: string;
  title: string;
  totalGoal: number;
  fundedAmount: number;
  milestones: Milestone[];
  createdAt: string;
  role: Role;
};

export const calculatePercentage = (total: number, funded: number) => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((funded / total) * 100));
};

export const mockEscrow: EscrowState = {
  id: 'escrow_01',
  title: 'Course Production — Module 3',
  totalGoal: 2000,
  fundedAmount: 1250,
  milestones: [
    {
      id: 'm1',
      title: 'Spec & Scripting',
      amount: 500,
      fundedAmount: 500,
      status: 'RELEASED',
      dueDate: '2026-03-01',
    },
    {
      id: 'm2',
      title: 'Recording',
      amount: 800,
      fundedAmount: 500,
      status: 'FUNDED',
      dueDate: '2026-04-01',
    },
    {
      id: 'm3',
      title: 'Editing & QA',
      amount: 700,
      fundedAmount: 250,
      status: 'PENDING',
      dueDate: '2026-05-01',
    },
  ],
  createdAt: '2026-02-01T10:00:00.000Z',
  role: 'contributor',
};
