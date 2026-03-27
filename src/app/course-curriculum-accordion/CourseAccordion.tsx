'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import type { Module } from './types';

interface Props {
  modules: Module[];
  currentLessonId?: string;
}

export default function CourseAccordion({ modules, currentLessonId }: Props) {
  const [openModules, setOpenModules] = useState<string[]>([]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
    );
  };

  return (
    <div className={styles.accordion}>
      {modules.map((mod) => (
        <div key={mod.id} className={styles.module}>
          <div
            className={styles.moduleHeader}
            onClick={() => toggleModule(mod.id)}
          >
            <span>{mod.title}</span>
            <span>{openModules.includes(mod.id) ? '−' : '+'}</span>
          </div>

          {openModules.includes(mod.id) && (
            <ul className={styles.lessonList}>
              {mod.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`${styles.lessonItem} ${
                    lesson.id === currentLessonId ? styles.currentLesson : ''
                  }`}
                >
                  <span>{lesson.title}</span>
                  <span>{lesson.completed ? '✔' : '○'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
