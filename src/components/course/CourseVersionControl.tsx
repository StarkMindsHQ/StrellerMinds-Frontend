import React, { useState, useEffect } from 'react';
import { getVersions, restoreVersion } from '../../services/courseVersionService';

interface CourseVersion {
  id: string;
  timestamp: string;
  author: string;
  changes: string;
}

export default function CourseVersionControl({ courseId }: { courseId: string }) {
  const [versions, setVersions] = useState<CourseVersion[]>([]);

  useEffect(() => {
    getVersions(courseId).then(setVersions);
  }, [courseId]);

  const handleRestore = async (versionId: string) => {
    await restoreVersion(courseId, versionId);
    setVersions(await getVersions(courseId));
  };

  return (
    <div>
      <h2>Course Version History</h2>
      <ul>
        {versions.map(v => (
          <li key={v.id}>
            <strong>{v.timestamp}</strong> by {v.author}
            <p>{v.changes}</p>
            <button onClick={() => handleRestore(v.id)}>Restore</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
