import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CourseVersion } from '../entities/course-version.entity';

@Injectable()
export class CourseVersionService {
  constructor(private readonly repo: Repository<CourseVersion>) {}

  async listVersions(courseId: string) {
    return this.repo.find({ where: { courseId }, order: { timestamp: 'DESC' } });
  }

  async restoreVersion(courseId: string, versionId: string) {
    const version = await this.repo.findOneBy({ id: versionId, courseId });
    if (!version) throw new Error('Version not found');

    // Logic to restore course content from version snapshot
    // e.g., update Course entity with version.content
    return { success: true };
  }
}
