import React, { useEffect, useState } from 'react';
import {
  connectEditor,
  applyChange,
} from '../../services/collaborationService';

export default function CollaborationEditor({
  courseId,
  userRole,
}: {
  courseId: string;
  userRole: string;
}) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const unsubscribe = connectEditor(courseId, (newContent: string) => {
      setContent(newContent);
    });
    return () => unsubscribe();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (userRole !== 'editor') return; // role-based restriction
    const newContent = e.target.value;
    setContent(newContent);
    applyChange(courseId, newContent);
  };

  return (
    <div>
      <h2>Collaboration Editor</h2>
      <textarea
        value={content}
        onChange={handleChange}
        disabled={userRole !== 'editor'}
      />
      {userRole !== 'editor' && <p>You have read-only access.</p>}
    </div>
  );
}
