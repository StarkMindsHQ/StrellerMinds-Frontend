'use client';

import { useState } from 'react';
import { useCollaboration } from '@/contexts/collaboration-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus, LogIn, LogOut, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateSessionName } from '@/lib/collaboration/utils';

export default function SessionManager() {
  const {
    state,
    createSession,
    joinSession,
    leaveSession,
    connect,
    disconnect,
  } = useCollaboration();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [maxUsers, setMaxUsers] = useState<number | undefined>();

  const handleCreateSession = async () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const validation = validateSessionName(sessionName);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Connect if not connected
    if (!state.isConnected) {
      connect();
      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const id = await createSession({
      name: sessionName,
      isPublic,
      maxUsers: maxUsers || undefined,
    });

    if (id) {
      setCreateOpen(false);
      setSessionName('');
      toast.success('Session created! Share the session ID with others.');
    } else {
      toast.error('Failed to create session');
    }
  };

  const handleJoinSession = async () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!sessionId.trim()) {
      toast.error('Please enter a session ID');
      return;
    }

    // Connect if not connected
    if (!state.isConnected) {
      connect();
      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const success = await joinSession({
      sessionId: sessionId.trim(),
      userId: state.currentUser?.id || `user-${Date.now()}`,
      userName: userName.trim(),
    });

    if (success) {
      setJoinOpen(false);
      setSessionId('');
      toast.success('Joined session successfully!');
    } else {
      toast.error('Failed to join session');
    }
  };

  const handleLeaveSession = () => {
    leaveSession();
    toast.info('Left the session');
  };

  const copySessionId = () => {
    if (state.session) {
      navigator.clipboard.writeText(state.session.id);
      toast.success('Session ID copied to clipboard');
    }
  };

  const shareSession = () => {
    if (state.session) {
      const url = `${window.location.origin}${window.location.pathname}?session=${state.session.id}`;
      navigator.clipboard.writeText(url);
      toast.success('Session link copied to clipboard');
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
      {!state.session ? (
        <>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[36px] sm:min-h-0 touch-manipulation"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Create Session</span>
                <span className="xs:hidden">Create</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collaboration Session</DialogTitle>
                <DialogDescription>
                  Create a new session for real-time collaborative coding
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Your Name</Label>
                  <Input
                    id="user-name"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    placeholder="My Coding Session"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public"
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(checked === true)}
                  />
                  <Label htmlFor="public" className="text-sm font-normal">
                    Public session (anyone can join)
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-users">Max Users (optional)</Label>
                  <Input
                    id="max-users"
                    type="number"
                    min="2"
                    max="50"
                    placeholder="No limit"
                    value={maxUsers || ''}
                    onChange={(e) =>
                      setMaxUsers(
                        e.target.value ? parseInt(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
                <Button onClick={handleCreateSession} className="w-full">
                  Create Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 text-xs sm:text-sm min-h-[36px] sm:min-h-0 touch-manipulation"
              >
                <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Join Session</span>
                <span className="xs:hidden">Join</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Collaboration Session</DialogTitle>
                <DialogDescription>
                  Enter a session ID to join an existing session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="join-user-name">Your Name</Label>
                  <Input
                    id="join-user-name"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-session-id">Session ID</Label>
                  <Input
                    id="join-session-id"
                    placeholder="session-xxxx-xxxx-xxxx"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                  />
                </div>
                <Button onClick={handleJoinSession} className="w-full">
                  Join Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-muted rounded-md text-xs sm:text-sm">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-medium truncate max-w-[120px] sm:max-w-none">
              {state.session.name}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({state.session.users.length})
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copySessionId}
            className="gap-1 sm:gap-2 min-h-[36px] sm:min-h-0 touch-manipulation"
            title="Copy Session ID"
          >
            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Copy ID</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareSession}
            className="gap-1 sm:gap-2 min-h-[36px] sm:min-h-0 touch-manipulation"
            title="Share Session"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeaveSession}
            className="gap-1 sm:gap-2 min-h-[36px] sm:min-h-0 touch-manipulation"
            title="Leave Session"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Leave</span>
          </Button>
        </div>
      )}
    </div>
  );
}
