'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCollaboration } from '@/contexts/collaboration-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

/**
 * WebRTC Voice/Video Chat Component
 *
 * Supports peer-to-peer voice/video calls with WebRTC signaling
 * Uses mesh architecture (each user connects to all others)
 */
export default function WebRTCChat() {
  const {
    state,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendWebRTCIceCandidate,
    endWebRTCCall,
    getSocket,
  } = useCollaboration();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<Set<string>>(
    new Set(),
  );

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // WebRTC configuration (use TURN server in production)
  const rtcConfiguration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      // Add your TURN server here for production
      // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
    ],
  };

  // Initialize WebRTC signaling listeners
  useEffect(() => {
    if (!state.session || !state.isConnected || !state.currentUser) {
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      return; // Socket not ready yet, will retry when connected
    }

    // Listen for WebRTC offers
    socket.on('webrtc-offer', async (data: any) => {
      const { fromUserId, offer } = data;
      if (!fromUserId || fromUserId === state.currentUser?.id || !offer) return;

      try {
        // Create peer connection if it doesn't exist
        let peerConnection = peerConnectionsRef.current.get(fromUserId);
        if (!peerConnection) {
          peerConnection = new RTCPeerConnection(rtcConfiguration);
          peerConnectionsRef.current.set(fromUserId, peerConnection);

          // Handle remote stream
          peerConnection.ontrack = (event) => {
            const remoteVideo = remoteVideosRef.current.get(fromUserId);
            if (remoteVideo) {
              remoteVideo.srcObject = event.streams[0];
            }
            setActiveParticipants((prev) => new Set(prev).add(fromUserId));
          };

          // Handle ICE candidates
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              sendWebRTCIceCandidate(event.candidate.toJSON(), fromUserId);
            }
          };

          // Add local stream if available
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
              peerConnection!.addTrack(track, localStreamRef.current!);
            });
          }
        }

        // Set remote description and create answer
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Send answer
        sendWebRTCAnswer(answer, fromUserId);
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
        toast.error('Failed to handle incoming call');
      }
    });

    // Listen for WebRTC answers
    socket.on('webrtc-answer', async (data: any) => {
      const { fromUserId, answer } = data;
      if (!fromUserId || !answer) return;

      try {
        const peerConnection = peerConnectionsRef.current.get(fromUserId);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer),
          );
        }
      } catch (error) {
        console.error('Error handling WebRTC answer:', error);
      }
    });

    // Listen for ICE candidates
    socket.on('webrtc-ice-candidate', async (data: any) => {
      const { fromUserId, candidate } = data;
      if (!fromUserId || !candidate) return;

      try {
        const peerConnection = peerConnectionsRef.current.get(fromUserId);
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    // Listen for call ended
    socket.on('webrtc-call-ended', (data: any) => {
      const { userId } = data;
      if (userId && userId !== state.currentUser?.id) {
        const peerConnection = peerConnectionsRef.current.get(userId);
        if (peerConnection) {
          peerConnection.close();
          peerConnectionsRef.current.delete(userId);
        }
        const remoteVideo = remoteVideosRef.current.get(userId);
        if (remoteVideo) {
          remoteVideo.srcObject = null;
        }
        setActiveParticipants((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    });

    // Listen for call state updates
    socket.on('webrtc-call-state', (data: any) => {
      const { userId, isInCall } = data;
      if (userId && userId !== state.currentUser?.id) {
        if (isInCall) {
          setActiveParticipants((prev) => new Set(prev).add(userId));
        }
      }
    });

    return () => {
      // Cleanup event listeners (don't disconnect - socket is shared)
      if (socket) {
        socket.off('webrtc-offer');
        socket.off('webrtc-answer');
        socket.off('webrtc-ice-candidate');
        socket.off('webrtc-call-ended');
        socket.off('webrtc-call-state');
      }
    };
  }, [
    state.session,
    state.isConnected,
    state.currentUser,
    sendWebRTCAnswer,
    sendWebRTCIceCandidate,
    getSocket,
  ]);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to all existing peer connections
      peerConnectionsRef.current.forEach((peerConnection) => {
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      });

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera/microphone');
      return null;
    }
  }, [isVideoEnabled, isAudioEnabled]);

  // Start call - create offers for all other users
  const startCall = useCallback(async () => {
    if (!state.session || !state.isConnected || !state.currentUser) {
      toast.error('Not connected to a session');
      return;
    }

    try {
      const stream = await initializeLocalStream();
      if (!stream) return;

      // Get all other users in the session
      const otherUsers = Array.from(state.users.values()).filter(
        (user) => user.id !== state.currentUser?.id && user.isActive,
      );

      if (otherUsers.length === 0) {
        toast.info('No other users in the session to call');
        return;
      }

      // Create peer connections and send offers to all other users
      for (const user of otherUsers) {
        try {
          const peerConnection = new RTCPeerConnection(rtcConfiguration);
          peerConnectionsRef.current.set(user.id, peerConnection);

          // Add local stream tracks
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          // Handle remote stream
          peerConnection.ontrack = (event) => {
            const remoteVideo = remoteVideosRef.current.get(user.id);
            if (remoteVideo) {
              remoteVideo.srcObject = event.streams[0];
            }
            setActiveParticipants((prev) => new Set(prev).add(user.id));
          };

          // Handle ICE candidates
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              sendWebRTCIceCandidate(event.candidate.toJSON(), user.id);
            }
          };

          // Create and send offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          sendWebRTCOffer(offer, user.id);
        } catch (error) {
          console.error(
            `Error creating peer connection with ${user.name}:`,
            error,
          );
        }
      }

      setIsCallActive(true);
      toast.success('Call started');
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    }
  }, [
    state.session,
    state.isConnected,
    state.currentUser,
    state.users,
    initializeLocalStream,
    sendWebRTCOffer,
    sendWebRTCIceCandidate,
  ]);

  // End call
  const endCall = useCallback(() => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((peerConnection) => {
      peerConnection.close();
    });
    peerConnectionsRef.current.clear();

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    remoteVideosRef.current.forEach((video) => {
      video.srcObject = null;
    });
    remoteVideosRef.current.clear();

    // Notify server
    endWebRTCCall();

    setIsCallActive(false);
    setActiveParticipants(new Set());
    toast.info('Call ended');
  }, [endWebRTCCall]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    } else if (!isVideoEnabled && isCallActive) {
      // Start video during call
      const stream = await initializeLocalStream();
      if (stream) {
        setIsVideoEnabled(true);
      }
    }
  }, [isVideoEnabled, isCallActive, initializeLocalStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  }, [isAudioEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  // Create remote video elements dynamically
  const createRemoteVideoRef = useCallback((userId: string) => {
    if (!remoteVideosRef.current.has(userId)) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.playsInline = true;
      video.className = 'w-full h-full object-cover';
      remoteVideosRef.current.set(userId, video);
    }
    return remoteVideosRef.current.get(userId)!;
  }, []);

  if (!state.session) {
    return null;
  }

  const otherUsers = Array.from(state.users.values()).filter(
    (user) => user.id !== state.currentUser?.id,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Voice/Video Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Local video */}
        <div className="aspect-video bg-black rounded-md overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              <VideoOff className="h-12 w-12" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            You
          </div>
        </div>

        {/* Remote videos */}
        {otherUsers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Participants ({otherUsers.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {otherUsers.map((user) => {
                const isParticipating = activeParticipants.has(user.id);
                return (
                  <div
                    key={user.id}
                    className="aspect-video bg-black rounded-md overflow-hidden relative"
                  >
                    <video
                      ref={(el) => {
                        if (el) {
                          remoteVideosRef.current.set(user.id, el);
                        }
                      }}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {!isParticipating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                        <VideoOff className="h-8 w-8" />
                      </div>
                    )}
                    <div
                      className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
                      style={{ borderLeft: `3px solid ${user.color}` }}
                    >
                      {user.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isCallActive ? (
            <Button
              onClick={startCall}
              className="gap-2"
              disabled={otherUsers.length === 0}
            >
              <Phone className="h-4 w-4" />
              Start Call
            </Button>
          ) : (
            <>
              <Button
                onClick={toggleVideo}
                variant={isVideoEnabled ? 'primary' : 'outline'}
                size="icon"
                title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {isVideoEnabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={toggleAudio}
                variant={isAudioEnabled ? 'primary' : 'outline'}
                size="icon"
                title={isAudioEnabled ? 'Mute' : 'Unmute'}
              >
                {isAudioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={endCall}
                variant="destructive"
                size="icon"
                title="End call"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {otherUsers.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            No other users in session to call
          </p>
        )}
      </CardContent>
    </Card>
  );
}
