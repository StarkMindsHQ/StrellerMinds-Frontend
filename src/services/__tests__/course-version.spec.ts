import { describe, expect, it, vi } from 'vitest';
import {
  CourseVersionService,
  type CourseVersionRecord,
} from '../course-version.service';

const versions: CourseVersionRecord[] = [
  {
    id: 'version2',
    courseId: 'course1',
    timestamp: new Date('2026-04-24T10:00:00Z'),
  },
  {
    id: 'version1',
    courseId: 'course1',
    timestamp: new Date('2026-04-23T10:00:00Z'),
  },
];

describe('Course Version Control', () => {
  const repo = {
    find: vi.fn().mockResolvedValue(versions),
    findOneBy: vi
      .fn()
      .mockImplementation(({ id }: { id: string }) =>
        Promise.resolve(versions.find((version) => version.id === id) ?? null),
      ),
  };

  const service = new CourseVersionService(repo);

  it('lists versions', async () => {
    const result = await service.listVersions('course1');

    expect(result).toHaveLength(2);
    expect(repo.find).toHaveBeenCalledWith({
      where: { courseId: 'course1' },
      order: { timestamp: 'DESC' },
    });
  });

  it('restores a version', async () => {
    const result = await service.restoreVersion('course1', 'version1');

    expect(result.success).toBe(true);
    expect(result.version.id).toBe('version1');
  });
});
