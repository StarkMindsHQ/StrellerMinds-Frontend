import { Controller, Get, Post, Param } from '@nestjs/common';
import { CourseVersionService } from '../services/course-version.service';

@Controller('courses/:courseId/versions')
export class CourseVersionController {
  constructor(private readonly service: CourseVersionService) {}

  @Get()
  async listVersions(@Param('courseId') courseId: string) {
    return this.service.listVersions(courseId);
  }

  @Post(':versionId/restore')
  async restore(@Param('courseId') courseId: string, @Param('versionId') versionId: string) {
    return this.service.restoreVersion(courseId, versionId);
  }
}
