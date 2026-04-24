export interface CourseVersionRecord {
  id: string;
  courseId: string;
  timestamp: Date | string;
  content?: unknown;
}

interface CourseVersionRepository {
  find(input: {
    where: { courseId: string };
    order: { timestamp: 'DESC' | 'ASC' };
  }): Promise<CourseVersionRecord[]>;
  findOneBy(input: {
    id: string;
    courseId: string;
  }): Promise<CourseVersionRecord | null>;
}

export class CourseVersionService {
  constructor(private readonly repo: CourseVersionRepository) {}

  async listVersions(courseId: string) {
    return this.repo.find({
      where: { courseId },
      order: { timestamp: 'DESC' },
    });
  }

  async restoreVersion(courseId: string, versionId: string) {
    const version = await this.repo.findOneBy({ id: versionId, courseId });

    if (!version) {
      throw new Error('Version not found');
    }

    return { success: true, version };
  }
}
