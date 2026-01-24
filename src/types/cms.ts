// ============================================
// CMS Types for Course Creation
// ============================================

// User and Role Types
export type UserRole =
  | 'admin'
  | 'instructor'
  | 'reviewer'
  | 'author'
  | 'viewer';

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  lastActive: Date;
}

export interface Permission {
  resource: 'courses' | 'lessons' | 'quizzes' | 'media' | 'users';
  actions: ('create' | 'read' | 'update' | 'delete' | 'publish' | 'review')[];
}

// Course Types
export type CourseStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail?: MediaAsset;
  coverImage?: MediaAsset;
  category: string;
  subcategory?: string;
  tags: string[];
  level: CourseLevel;
  duration: number; // in minutes
  status: CourseStatus;
  price: number;
  currency: string;
  instructors: CMSUser[];
  modules: CourseModule[];
  prerequisites: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  seoMetadata: SEOMetadata;
  settings: CourseSettings;
  version: number;
  versionHistory: ContentVersion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  analytics: CourseAnalytics;
}

export interface CourseSettings {
  enrollmentLimit?: number;
  certificateEnabled: boolean;
  discussionEnabled: boolean;
  downloadEnabled: boolean;
  completionCriteria: 'all_lessons' | 'all_quizzes' | 'percentage';
  completionPercentage?: number;
  accessDuration?: number; // days
  drip: DripSettings;
}

export interface DripSettings {
  enabled: boolean;
  schedule: 'daily' | 'weekly' | 'custom';
  customDays?: number;
}

export interface CourseAnalytics {
  enrollments: number;
  completions: number;
  averageRating: number;
  totalReviews: number;
  averageProgress: number;
  averageCompletionTime: number;
}

// Module Types
export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  unlockCriteria?: UnlockCriteria;
  lessons: Lesson[];
  quizzes: Quiz[];
  assignments: Assignment[];
  resources: Resource[];
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnlockCriteria {
  type: 'previous_module' | 'date' | 'quiz_score' | 'manual';
  value: string | number | Date;
}

// Lesson Types
export type LessonType = 'video' | 'text' | 'interactive' | 'mixed';
export type LessonStatus = 'draft' | 'review' | 'published';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  duration: number; // in minutes
  content: LessonContent;
  status: LessonStatus;
  isFree: boolean;
  isRequired: boolean;
  attachments: Resource[];
  version: number;
  versionHistory: ContentVersion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonContent {
  // For text lessons
  richText?: RichTextContent;
  // For video lessons
  video?: VideoContent;
  // For interactive lessons
  interactive?: InteractiveContent;
  // For mixed lessons
  blocks?: ContentBlock[];
}

export interface RichTextContent {
  html: string;
  json: object; // Slate.js JSON
  plainText: string;
  wordCount: number;
}

export interface VideoContent {
  source: 'upload' | 'youtube' | 'vimeo' | 'external';
  url: string;
  embedUrl?: string;
  duration: number;
  chapters: VideoChapter[];
  captions: Caption[];
  transcript?: string;
  poster?: string;
  quality: VideoQuality[];
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number;
  description?: string;
}

export interface Caption {
  language: string;
  label: string;
  url: string;
  isDefault: boolean;
}

export interface VideoQuality {
  quality: '360p' | '480p' | '720p' | '1080p' | '4k';
  url: string;
  bitrate: number;
  size: number;
}

export interface InteractiveContent {
  type: 'code_exercise' | 'simulation' | 'drag_drop' | 'hotspot';
  config: object;
  assets: MediaAsset[];
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'image' | 'code' | 'quiz' | 'callout' | 'divider';
  order: number;
  data: object;
}

// Quiz Types
export type QuizType = 'graded' | 'practice' | 'survey';
export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'
  | 'long_answer'
  | 'fill_blank'
  | 'matching'
  | 'ordering'
  | 'code';

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: QuizType;
  order: number;
  questions: Question[];
  settings: QuizSettings;
  passingScore: number;
  totalPoints: number;
  duration?: number; // in minutes
  status: LessonStatus;
  version: number;
  versionHistory: ContentVersion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showFeedback: 'immediate' | 'after_submit' | 'after_deadline' | 'never';
  attemptsAllowed: number;
  timeLimitEnabled: boolean;
  timeLimit?: number; // in minutes
  requirePassToProgress: boolean;
  showCorrectAnswers: boolean;
  allowReview: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  order: number;
  question: string;
  questionMedia?: MediaAsset;
  explanation?: string;
  points: number;
  required: boolean;
  options?: QuestionOption[];
  matchingPairs?: MatchingPair[];
  orderingItems?: OrderingItem[];
  blanks?: BlankItem[];
  codeConfig?: CodeQuestionConfig;
  correctAnswer?: string | string[];
  rubric?: GradingRubric;
}

export interface QuestionOption {
  id: string;
  text: string;
  media?: MediaAsset;
  isCorrect: boolean;
  feedback?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  leftMedia?: MediaAsset;
  rightMedia?: MediaAsset;
}

export interface OrderingItem {
  id: string;
  text: string;
  correctPosition: number;
}

export interface BlankItem {
  id: string;
  placeholder: string;
  acceptedAnswers: string[];
  caseSensitive: boolean;
}

export interface CodeQuestionConfig {
  language: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  runnable: boolean;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  points: number;
}

export interface GradingRubric {
  criteria: RubricCriteria[];
}

export interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  description: string;
}

// Assignment Types
export type AssignmentType =
  | 'file_upload'
  | 'text_submission'
  | 'code_submission'
  | 'link_submission';

export interface Assignment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  instructions: RichTextContent;
  type: AssignmentType;
  order: number;
  dueDate?: Date;
  points: number;
  settings: AssignmentSettings;
  rubric?: GradingRubric;
  attachments: Resource[];
  status: LessonStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSettings {
  allowLateSubmission: boolean;
  latePenalty?: number; // percentage per day
  maxSubmissions: number;
  peerReviewEnabled: boolean;
  peerReviewCount?: number;
  plagiarismCheckEnabled: boolean;
  fileTypes?: string[];
  maxFileSize?: number; // in MB
}

// Resource/Media Types
export type ResourceType =
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'link'
  | 'other';

export interface Resource {
  id: string;
  name: string;
  description?: string;
  type: ResourceType;
  file?: MediaAsset;
  url?: string;
  downloadable: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAsset {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  dimensions?: { width: number; height: number };
  duration?: number; // for video/audio
  metadata: Record<string, unknown>;
  alt?: string;
  caption?: string;
  folder?: string;
  tags: string[];
  uploadedBy: string;
  createdAt: Date;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  assetCount: number;
  createdAt: Date;
}

// Version Control Types
export interface ContentVersion {
  id: string;
  contentType: 'course' | 'lesson' | 'quiz' | 'assignment';
  contentId: string;
  version: number;
  changes: VersionChange[];
  snapshot: object;
  message?: string;
  createdBy: string;
  createdAt: Date;
  restorable: boolean;
}

export interface VersionChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type: 'added' | 'modified' | 'removed';
}

export interface VersionComparison {
  fromVersion: number;
  toVersion: number;
  changes: VersionChange[];
  additions: number;
  modifications: number;
  deletions: number;
}

// Collaboration Types
export type CommentStatus = 'open' | 'resolved' | 'dismissed';
export type ReviewStatus =
  | 'pending'
  | 'approved'
  | 'changes_requested'
  | 'rejected';

export interface Comment {
  id: string;
  contentType: 'course' | 'lesson' | 'quiz' | 'assignment';
  contentId: string;
  parentId?: string;
  author: CMSUser;
  text: string;
  selection?: TextSelection;
  status: CommentStatus;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface TextSelection {
  startOffset: number;
  endOffset: number;
  selectedText: string;
}

export interface Review {
  id: string;
  contentType: 'course' | 'lesson';
  contentId: string;
  reviewer: CMSUser;
  status: ReviewStatus;
  feedback: string;
  checklist: ReviewChecklist;
  comments: Comment[];
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface ReviewChecklist {
  items: ReviewChecklistItem[];
}

export interface ReviewChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
  note?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'module' | 'lesson' | 'quiz';
  thumbnail?: string;
  content: object;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  usageCount: number;
}

// SEO Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  noFollow: boolean;
  structuredData?: object;
}

// Draft/Autosave Types
export interface Draft {
  id: string;
  contentType: 'course' | 'lesson' | 'quiz' | 'assignment';
  contentId: string;
  data: object;
  lastSavedAt: Date;
  savedBy: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  action:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'published'
    | 'archived'
    | 'reviewed'
    | 'commented';
  contentType: string;
  contentId: string;
  contentTitle: string;
  user: CMSUser;
  details?: object;
  timestamp: Date;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  stages: WorkflowStage[];
  isActive: boolean;
  createdAt: Date;
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  requiredApprovers: number;
  approvers: string[]; // user roles or specific user IDs
  autoAdvance: boolean;
  notifications: WorkflowNotification[];
}

export interface WorkflowNotification {
  event: 'enter_stage' | 'approved' | 'rejected' | 'comment';
  recipients: 'author' | 'approvers' | 'admins';
  template: string;
}

// CMS State Types
export interface CMSState {
  currentUser: CMSUser | null;
  currentCourse: Course | null;
  courses: Course[];
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  sidebarOpen: boolean;
  previewMode: boolean;
  activeDraft: Draft | null;
  recentActivity: ActivityLog[];
  notifications: CMSNotification[];
}

export interface CMSNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
