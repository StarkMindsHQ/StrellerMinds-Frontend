'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  Image as ImageIcon,
  Video,
  Music,
  MoreVertical,
  ChevronRight,
  Search,
  Grid,
  List as ListIcon,
  Trash2,
  Download,
  ExternalLink,
  Folder,
  FolderPlus,
  X,
  Check,
  Filter,
  SortAsc,
  LayoutGrid,
  Info,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { MediaAsset, MediaFolder } from '@/types/cms';

interface MediaManagerProps {
  onSelect?: (asset: MediaAsset) => void;
  allowSelection?: boolean;
  multiSelect?: boolean;
}

export function MediaManager({
  onSelect,
  allowSelection = false,
  multiSelect = false,
}: MediaManagerProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const [folders, setFolders] = useState<MediaFolder[]>([
    {
      id: '1',
      name: 'Course Thumbnails',
      path: '/thumbnails',
      assetCount: 12,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Lesson Videos',
      path: '/videos',
      assetCount: 8,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'PDF Resources',
      path: '/resources',
      assetCount: 25,
      createdAt: new Date(),
    },
  ]);

  const [assets, setAssets] = useState<MediaAsset[]>([
    {
      id: 'a1',
      name: 'intro-thumbnail.jpg',
      originalName: 'intro-thumbnail.jpg',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 1024 * 512,
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
      metadata: {},
      tags: ['intro', 'course'],
      uploadedBy: 'user-1',
      createdAt: new Date(),
    },
    {
      id: 'a2',
      name: 'react-hooks-explained.mp4',
      originalName: 'react-hooks-explained.mp4',
      type: 'video',
      mimeType: 'video/mp4',
      size: 1024 * 1024 * 25,
      url: '#',
      duration: 345,
      metadata: {},
      tags: ['react', 'tutorial'],
      uploadedBy: 'user-1',
      createdAt: new Date(),
    },
    {
      id: 'a3',
      name: 'syllabus-2024.pdf',
      originalName: 'syllabus-2024.pdf',
      type: 'document',
      mimeType: 'application/pdf',
      size: 1024 * 100,
      url: '#',
      metadata: {},
      tags: ['admin', 'syllabus'],
      uploadedBy: 'user-1',
      createdAt: new Date(),
    },
  ]);

  const handleUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      const newAssets: MediaAsset[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        originalName: file.name,
        type: file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : 'document',
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        metadata: {},
        tags: [],
        uploadedBy: 'current-user',
        createdAt: new Date(),
      }));

      setAssets((prev) => [...newAssets, ...prev]);
      setIsUploading(false);
      toast.success(`${files.length} file(s) uploaded successfully`);
    }, 1500);
  }, []);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    if (!allowSelection) return;
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (!multiSelect) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    toast.success('Asset deleted');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="text-blue-500" />;
      case 'video':
        return <Video className="text-purple-500" />;
      case 'audio':
        return <Music className="text-pink-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="flex flex-col h-full bg-background border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search media..."
              className="pl-9 w-[260px] h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <SortAsc className="w-4 h-4" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Size (Large to Small)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md border mr-2">
            <button
              className={`p-1.5 rounded ${view === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className={`p-1.5 rounded ${view === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2"
            onClick={() => toast('Folder creation coming soon')}
          >
            <FolderPlus className="w-4 h-4" /> New Folder
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            size="sm"
            className="h-9 gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Upload className="w-4 h-4" />
              </motion.div>
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {/* Breadcrumbs / Navigation */}
      <div className="px-4 py-2 border-b text-sm flex items-center gap-2 text-muted-foreground">
        <button className="hover:text-primary transition-colors">
          All Files
        </button>
        {currentFolderId && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {folders.find((f) => f.id === currentFolderId)?.name}
            </span>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Folders */}
        {!searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {folders.map((folder) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={folder.id}
                className="group relative flex flex-col items-center p-4 border rounded-xl hover:bg-accent/50 cursor-pointer transition-all"
                onClick={() => setCurrentFolderId(folder.id)}
              >
                <Folder className="w-12 h-12 text-primary/60 mb-2 group-hover:text-primary" />
                <span className="text-sm font-medium text-center truncate w-full">
                  {folder.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {folder.assetCount} items
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Assets Grid */}
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
              : 'space-y-2'
          }
        >
          {filteredAssets.map((asset) => (
            <motion.div
              layout
              key={asset.id}
              className={`
                group relative border rounded-xl overflow-hidden bg-card 
                ${selectedIds.has(asset.id) ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-md'} 
                ${view === 'list' ? 'flex items-center p-2' : 'flex flex-col'}
                transition-all cursor-pointer
              `}
              onClick={(e) =>
                onSelect ? onSelect(asset) : toggleSelect(asset.id, e)
              }
            >
              {/* Selection Checkbox */}
              {allowSelection && (
                <div
                  className={`
                  absolute top-2 left-2 z-10 w-5 h-5 rounded-full border bg-background flex items-center justify-center 
                  ${selectedIds.has(asset.id) ? 'bg-primary border-primary text-white' : 'opacity-0 group-hover:opacity-100'}
                  transition-opacity
                `}
                >
                  {selectedIds.has(asset.id) && <Check className="w-3 h-3" />}
                </div>
              )}

              {/* Asset Preview */}
              <div
                className={`
                relative bg-muted/30 flex-shrink-0
                ${view === 'grid' ? 'aspect-video' : 'w-12 h-12 rounded-lg mr-4'}
                flex items-center justify-center
              `}
              >
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(asset.type)
                )}

                {asset.type === 'video' && view === 'grid' && (
                  <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] text-white px-1.5 py-0.5 rounded">
                    {Math.floor(asset.duration! / 60)}:
                    {(asset.duration! % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Asset Info */}
              <div
                className={`p-3 min-w-0 flex-1 flex flex-col ${view === 'list' ? 'flex-row items-center justify-between' : ''}`}
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate mb-0.5"
                    title={asset.name}
                  >
                    {asset.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(asset.size / 1024).toFixed(1)} KB •{' '}
                    {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                  </p>
                </div>

                <div
                  className={`${view === 'grid' ? 'mt-2 flex opacity-0 group-hover:opacity-100' : 'flex'} transition-opacity gap-1`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(asset.url);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="w-4 h-4 mr-2" /> Open in New
                        Tab
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteAsset(asset.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No assets found</p>
            <p className="text-sm">
              Try searching for something else or upload a new file
            </p>
          </div>
        )}
      </div>

      {/* Footer / Info Bar */}
      {selectedIds.size > 0 && allowSelection && (
        <div className="p-4 border-t bg-primary/5 flex items-center justify-between">
          <p className="text-sm font-medium">
            {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onSelect) {
                  const selected = assets.find((a) => selectedIds.has(a.id));
                  if (selected) onSelect(selected);
                }
              }}
            >
              {multiSelect ? 'Use Selected Items' : 'Use Selected Item'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
