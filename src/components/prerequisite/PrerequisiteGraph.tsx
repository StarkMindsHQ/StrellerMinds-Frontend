'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle,
  Lock,
  Play,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CourseNode {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  status: 'completed' | 'available' | 'locked';
  progress?: number;
  description?: string;
  instructor?: string;
  rating?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: 'required' | 'recommended';
}

interface PrerequisiteGraphProps {
  courseId?: string;
  userId?: string;
  className?: string;
}

export function PrerequisiteGraph({
  courseId,
  userId = 'user@example.com',
  className,
}: PrerequisiteGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<CourseNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CourseNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock course data
  const mockCourses: CourseNode[] = [
    {
      id: 'blockchain-fundamentals',
      title: 'Blockchain Fundamentals',
      level: 'Beginner',
      durationHours: 6,
      status: 'completed',
      progress: 100,
      description: 'Learn the core concepts of blockchain technology',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
    },
    {
      id: 'stellar-smart-contract',
      title: 'Stellar Smart Contract Development',
      level: 'Intermediate',
      durationHours: 8,
      status: 'available',
      progress: 30,
      description: 'Master smart contract development on Stellar',
      instructor: 'Alex Rodriguez',
      rating: 4.9,
    },
    {
      id: 'defi-stellar',
      title: 'DeFi on Stellar',
      level: 'Advanced',
      durationHours: 10,
      status: 'locked',
      description: 'Build decentralized finance applications',
      instructor: 'Michael Thompson',
      rating: 4.7,
    },
    {
      id: 'blockchain-security',
      title: 'Blockchain Security',
      level: 'Intermediate',
      durationHours: 7,
      status: 'available',
      progress: 0,
      description: 'Learn security best practices for blockchain',
      instructor: 'Dr. Emily Davis',
      rating: 4.6,
    },
    {
      id: 'nft-development',
      title: 'NFT Development',
      level: 'Advanced',
      durationHours: 12,
      status: 'locked',
      description: 'Build NFT marketplaces and collections',
      instructor: 'Sarah Johnson',
      rating: 4.9,
    },
  ];

  // Mock prerequisite relationships
  const mockEdges: GraphEdge[] = [
    {
      from: 'blockchain-fundamentals',
      to: 'stellar-smart-contract',
      type: 'required',
    },
    { from: 'stellar-smart-contract', to: 'defi-stellar', type: 'required' },
    {
      from: 'blockchain-fundamentals',
      to: 'blockchain-security',
      type: 'required',
    },
    { from: 'stellar-smart-contract', to: 'nft-development', type: 'required' },
    { from: 'blockchain-security', to: 'nft-development', type: 'recommended' },
  ];

  useEffect(() => {
    const fetchPrerequisiteData = async () => {
      setLoading(true);
      try {
        // In production, fetch from API
        // const response = await fetch(`/api/courses/prerequisites/graph?courseId=${courseId}&userId=${userId}`);
        // const data = await response.json();

        // Use mock data for now
        setNodes(mockCourses);
        setEdges(mockEdges);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load prerequisite data',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrerequisiteData();
  }, [courseId, userId]);

  useEffect(() => {
    if (canvasRef.current && nodes.length > 0) {
      drawGraph();
    }
  }, [nodes, edges, zoom, offset, selectedNode]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Calculate node positions
    const nodePositions = calculateNodePositions();

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodePositions[edge.from];
      const toNode = nodePositions[edge.to];

      if (fromNode && toNode) {
        drawEdge(ctx, fromNode, toNode, edge.type);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const position = nodePositions[node.id];
      if (position) {
        drawNode(ctx, node, position);
      }
    });

    ctx.restore();
  };

  const calculateNodePositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    const levels = calculateNodeLevels();

    Object.entries(levels).forEach(([nodeId, level], index) => {
      const nodesInLevel = Object.entries(levels).filter(
        ([_, l]) => l === level,
      );
      const positionInLevel = nodesInLevel.findIndex(([n]) => n === nodeId);

      positions[nodeId] = {
        x: 150 + positionInLevel * 200,
        y: 100 + level * 150,
      };
    });

    return positions;
  };

  const calculateNodeLevels = () => {
    const levels: Record<string, number> = {};
    const visited = new Set<string>();

    const calculateLevel = (nodeId: string, currentLevel: number = 0) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const incomingEdges = edges.filter((edge) => edge.to === nodeId);
      if (incomingEdges.length === 0) {
        levels[nodeId] = 0;
      } else {
        const maxPrereqLevel = Math.max(
          ...incomingEdges.map((edge) => {
            calculateLevel(edge.from, currentLevel + 1);
            return levels[edge.from] || 0;
          }),
        );
        levels[nodeId] = maxPrereqLevel + 1;
      }

      // Process outgoing edges
      const outgoingEdges = edges.filter((edge) => edge.from === nodeId);
      outgoingEdges.forEach((edge) => {
        calculateLevel(edge.to, currentLevel + 1);
      });
    };

    nodes.forEach((node) => calculateLevel(node.id));
    return levels;
  };

  const drawNode = (
    ctx: CanvasRenderingContext2D,
    node: CourseNode,
    position: { x: number; y: number },
  ) => {
    const isSelected = selectedNode?.id === node.id;
    const nodeSize = 60;

    // Node shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Node background based on status
    let bgColor = '#e5e7eb'; // locked
    if (node.status === 'completed') bgColor = '#dcfce7';
    else if (node.status === 'available') bgColor = '#dbeafe';

    // Draw node circle
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = isSelected ? '#3b82f6' : '#9ca3af';
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.beginPath();
    ctx.arc(position.x, position.y, nodeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw status icon
    ctx.fillStyle =
      node.status === 'completed'
        ? '#16a34a'
        : node.status === 'available'
          ? '#2563eb'
          : '#6b7280';

    let iconY = position.y - 5;
    if (node.status === 'completed') {
      // Draw checkmark
      ctx.beginPath();
      ctx.arc(position.x - 15, iconY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(position.x - 19, iconY);
      ctx.lineTo(position.x - 15, iconY + 4);
      ctx.lineTo(position.x - 11, iconY - 4);
      ctx.stroke();
    } else if (node.status === 'available') {
      // Draw play icon
      ctx.beginPath();
      ctx.moveTo(position.x - 18, iconY - 8);
      ctx.lineTo(position.x - 18, iconY + 8);
      ctx.lineTo(position.x - 8, iconY);
      ctx.closePath();
      ctx.fill();
    } else {
      // Draw lock icon
      ctx.fillRect(position.x - 18, iconY - 2, 16, 12);
      ctx.fillRect(position.x - 14, iconY - 8, 8, 6);
    }

    // Draw level badge
    const levelColors = {
      Beginner: '#16a34a',
      Intermediate: '#ca8a04',
      Advanced: '#9333ea',
    };
    ctx.fillStyle = levelColors[node.level];
    ctx.fillRect(position.x + 10, position.y - 25, 20, 8);

    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.title.substring(0, 15), position.x, position.y + 40);

    // Draw progress if available
    if (node.progress !== undefined && node.progress > 0) {
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(position.x - 30, position.y + 50, 60, 4);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(
        position.x - 30,
        position.y + 50,
        (60 * node.progress) / 100,
        4,
      );
    }
  };

  const drawEdge = (
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    type: 'required' | 'recommended',
  ) => {
    ctx.strokeStyle = type === 'required' ? '#ef4444' : '#f59e0b';
    ctx.lineWidth = type === 'required' ? 2 : 1;

    if (type === 'recommended') {
      ctx.setLineDash([5, 5]);
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);

    // Draw curved line
    const controlPoint = {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2 - 30,
    };

    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, to.x, to.y);
    ctx.stroke();

    // Draw arrow
    const angle = Math.atan2(to.y - controlPoint.y, to.x - controlPoint.x);
    const arrowLength = 10;

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - arrowLength * Math.cos(angle - Math.PI / 6),
      to.y - arrowLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - arrowLength * Math.cos(angle + Math.PI / 6),
      to.y - arrowLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - offset.x) / zoom;
    const y = (event.clientY - rect.top - offset.y) / zoom;

    const nodePositions = calculateNodePositions();

    // Check if click is on a node
    for (const [nodeId, position] of Object.entries(nodePositions)) {
      const distance = Math.sqrt(
        Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2),
      );
      if (distance <= 60) {
        const node = nodes.find((n) => n.id === nodeId);
        setSelectedNode(node || null);
        break;
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX - offset.x, y: event.clientY - offset.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Course Prerequisites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Completed
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Available
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              Locked
            </Badge>
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="relative border rounded-lg overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="cursor-move"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedNode.title}</h3>
                <p className="text-sm text-gray-600">
                  {selectedNode.description}
                </p>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      selectedNode.level === 'Beginner'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {selectedNode.level}
                  </Badge>
                  <Badge variant="outline">
                    {selectedNode.durationHours} hours
                  </Badge>
                  {selectedNode.rating && (
                    <Badge variant="outline">⭐ {selectedNode.rating}</Badge>
                  )}
                </div>
                {selectedNode.instructor && (
                  <p className="text-sm text-gray-500">
                    Instructor: {selectedNode.instructor}
                  </p>
                )}
                {selectedNode.progress !== undefined && (
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{selectedNode.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedNode.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                disabled={selectedNode.status === 'locked'}
                className="flex items-center gap-2"
              >
                {selectedNode.status === 'completed' ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Review
                  </>
                ) : selectedNode.status === 'available' ? (
                  <>
                    <Play className="h-4 w-4" />
                    Continue
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Locked
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Red solid lines:</strong> Required prerequisites |
            <strong>Orange dashed lines:</strong> Recommended prerequisites |
            <strong>Click nodes</strong> to view course details
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
