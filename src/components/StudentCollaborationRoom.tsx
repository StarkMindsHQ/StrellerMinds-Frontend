'use client';

import { useState } from 'react';
import { Users, UserPlus, Crown, MessageSquare, FileText } from 'lucide-react';

export type ParticipantRole = 'owner' | 'editor' | 'viewer';

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  avatarUrl?: string;
}

export interface CollaborationNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface StudentCollaborationRoomProps {
  roomId: string;
  roomName?: string;
  currentUserId: string;
  initialParticipants?: Participant[];
  initialNotes?: CollaborationNote[];
  onInvite?: (email: string) => void;
  onNoteAdd?: (content: string) => void;
  onRoleChange?: (participantId: string, role: ParticipantRole) => void;
  className?: string;
}

const ROLE_LABELS: Record<ParticipantRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
};

const ROLE_COLORS: Record<ParticipantRole, string> = {
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function StudentCollaborationRoom({
  roomId,
  roomName = 'Collaboration Room',
  currentUserId,
  initialParticipants = [],
  initialNotes = [],
  onInvite,
  onNoteAdd,
  onRoleChange,
  className = '',
}: StudentCollaborationRoomProps) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [notes, setNotes] = useState<CollaborationNote[]>(initialNotes);
  const [activeTab, setActiveTab] = useState<'notes' | 'participants'>('notes');
  const [noteInput, setNoteInput] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const currentParticipant = participants.find((p) => p.id === currentUserId);
  const canEdit =
    currentParticipant?.role === 'owner' || currentParticipant?.role === 'editor';
  const isOwner = currentParticipant?.role === 'owner';

  const handleAddNote = () => {
    if (!noteInput.trim() || !canEdit) return;
    const note: CollaborationNote = {
      id: Date.now().toString(),
      authorId: currentUserId,
      authorName: currentParticipant?.name ?? 'You',
      content: noteInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, note]);
    onNoteAdd?.(noteInput.trim());
    setNoteInput('');
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newParticipant: Participant = {
      id: `invite-${Date.now()}`,
      name: inviteEmail.trim(),
      role: 'viewer',
    };
    setParticipants((prev) => [...prev, newParticipant]);
    onInvite?.(inviteEmail.trim());
    setInviteEmail('');
    setShowInvite(false);
  };

  const handleRoleChange = (participantId: string, role: ParticipantRole) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, role } : p)),
    );
    onRoleChange?.(participantId, role);
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{roomName}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            {participants.length}
          </span>
          {isOwner && (
            <button
              type="button"
              onClick={() => setShowInvite((v) => !v)}
              aria-label="Invite participant"
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite
            </button>
          )}
        </div>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="flex gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <input
            type="email"
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['notes', 'participants'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            {tab === 'notes' ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'notes' ? (
          <div className="flex flex-col gap-3">
            {notes.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No notes yet. {canEdit ? 'Add the first one!' : ''}
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {note.authorName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{note.content}</p>
                </div>
              ))
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {p.name}
                      {p.id === currentUserId && (
                        <span className="ml-1 text-xs text-gray-400">(you)</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.role === 'owner' && (
                    <Crown className="h-3.5 w-3.5 text-yellow-500" aria-label="Owner" />
                  )}
                  {isOwner && p.id !== currentUserId ? (
                    <select
                      value={p.role}
                      onChange={(e) =>
                        handleRoleChange(p.id, e.target.value as ParticipantRole)
                      }
                      aria-label={`Role for ${p.name}`}
                      className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[p.role]}`}
                    >
                      {ROLE_LABELS[p.role]}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Note input */}
      {activeTab === 'notes' && canEdit && (
        <div className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
          <input
            type="text"
            placeholder="Add a shared note..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleAddNote}
            disabled={!noteInput.trim()}
            aria-label="Add note"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
