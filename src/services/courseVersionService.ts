import axios from 'axios';

export async function getVersions(courseId: string) {
  const res = await axios.get(`/api/courses/${courseId}/versions`);
  return res.data;
}

export async function restoreVersion(courseId: string, versionId: string) {
  await axios.post(`/api/courses/${courseId}/versions/${versionId}/restore`);
}
