import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { toast } from 'sonner'

// --- Type Definitions --- (Moved Course here)

export interface Course {
  subject: string;
  title: string;
  description?: string;
  content: CourseContent[];
  assessment?: Assessment; // Optional assessment linked to the course
}

export type QuestionType = "mcq" | "theory" | "coding"

export interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface MCQQuestion {
  id: string
  type: "mcq"
  question: string
  options: MCQOption[]
  explanation?: string
}

export interface TheoryQuestion {
  id: string
  type: "theory"
  question: string
  criteria: string[]
  maxScore: number
}

export interface CodingQuestion {
  id: string
  type: "coding"
  question: string
  language: string
  starterCode: string
  testCases?: string[]
}

export type Question = MCQQuestion | TheoryQuestion | CodingQuestion

export interface Assessment {
  id: string
  title: string
  subject: string
  questions: Question[]
}

export interface UserAnswer {
  questionId: string
  answer: string | string[] | null
  isCorrect?: boolean
  score?: number
  feedback?: string
}

export interface CourseContent {
  id: string
  title: string
  content: string
  order: number
}

// User learning preferences
export interface LearningPreferences {
  difficulty: "beginner" | "intermediate" | "advanced"
  pacing: "slow" | "standard" | "accelerated"
  focusAreas?: string[]
  explanationDetail: "concise" | "balanced" | "detailed"
  examplePreference: "minimal" | "moderate" | "extensive"
  customPreferences?: string
}

// User profile with learning preferences and basic info
export interface UserProfile {
  id: string
  firstName?: string | null // Added
  lastName?: string | null // Added
  fullName?: string | null // Added
  imageUrl?: string | null // Added
  email?: string | null // Added
  learningPreferences: LearningPreferences
}

// Define the structure for progress within a single subject
export interface SubjectProgress {
  currentTopic: number;
  completedTopics: string[]; // Use topic IDs or titles
  testScores?: Record<string, number>;
  needsReinforcement?: string[];
  passedAssessments?: string[];
}

// Use an index signature for subjects
export interface CourseProgress {
  [subject: string]: SubjectProgress | undefined;
}

// Course topic for the index
export interface CourseTopic {
  id: string
  title: string
  description: string
  completed: boolean
  order: number
}

// --- Combined State Interface --- (Using AssessmentState as the main state)

interface AssessmentState {
  // User profile
  userProfile: UserProfile | null

  // Course and learning
  currentSubject: string | null
  currentCourse: Course | null // Added currentCourse based on usage
  courseContents: CourseContent[] // Content for the current subject/course
  currentContentIndex: number
  courseProgress: CourseProgress // Changed from CourseProgress | null
  enrolledCourses: string[]

  // Course index
  showCourseIndex: boolean
  courseTopics: CourseTopic[]

  // Assessment
  assessment: Assessment | null
  currentQuestionIndex: number
  userAnswers: Record<string, UserAnswer>
  isPanelOpen: boolean
  isLoading: boolean
  showExplanationPanel: boolean
  currentExplanation: string | null

  // Chat
  chatMessages: { role: "user" | "assistant"; content: string }[]

  // Content generation status
  isGeneratingContent: boolean

  // --- Actions --- (Defined directly in the store)

  // Actions - User Profile
  setUserProfile: (profile: UserProfile) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  updateLearningPreferences: (preferences: Partial<LearningPreferences>) => void

  // Actions - Course
  setCurrentSubject: (subject: string | null) => void
  setCurrentCourse: (course: Course | null) => void // Added action
  setCourseContents: (contents: CourseContent[]) => void
  setCurrentContentIndex: (index: number, subject: string) => void // Auto-saves progress
  enrollInCourse: (courseId: string) => void
  markTopicCompleted: (subject: string, topicId: string) => void // Updated signature
  saveTestScore: (subject: string, testId: string, score: number) => void // Updated signature
  markAssessmentPassed: (subject: string, assessmentId: string) => void // Updated signature
  resetCourseContents: () => void
  unenrollFromCourse: (courseId: string) => void
  loadSavedProgress: (subject: string) => boolean // Loads progress for a subject

  // Actions - Course Index
  setShowCourseIndex: (show: boolean) => void
  setCourseTopics: (topics: CourseTopic[]) => void
  updateCourseTopic: (topicId: string, updates: Partial<CourseTopic>) => void

  // Actions - Assessment
  setAssessment: (assessment: Assessment | null) => void
  setCurrentQuestionIndex: (index: number) => void
  setUserAnswer: (questionId: string, answer: UserAnswer) => void
  togglePanel: () => void
  setIsLoading: (isLoading: boolean) => void
  setShowExplanationPanel: (show: boolean) => void
  setCurrentExplanation: (explanation: string | null) => void
  resetAssessment: () => void
  hasPassedCurrentAssessment: (subject: string) => boolean // Updated signature

  // Actions - Chat
  addChatMessage: (role: "user" | "assistant", content: string) => void
  resetChat: () => void

  // Actions - Content Generation
  setIsGeneratingContent: (isGenerating: boolean) => void
}

// --- Store Implementation --- (Using single state object)

export const useBoundStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // --- Initial State --- 
      userProfile: null,
      currentSubject: null,
      currentCourse: null,
      courseContents: [],
      currentContentIndex: 0,
      courseProgress: {}, // Initialize as empty object
      enrolledCourses: [],
      showCourseIndex: false,
      courseTopics: [],
      assessment: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      isPanelOpen: false,
      isLoading: false,
      showExplanationPanel: false,
      currentExplanation: null,
      chatMessages: [],
      isGeneratingContent: false,

      // --- Actions Implementation --- 

      // User Profile Actions
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (updates) => set((state) => ({ userProfile: { ...state.userProfile!, ...updates } })),
      updateLearningPreferences: (preferences) => set((state) => ({
        userProfile: state.userProfile
          ? { ...state.userProfile, learningPreferences: { ...state.userProfile.learningPreferences, ...preferences } }
          : null,
      })),

      // Course Actions
      setCurrentSubject: (subject) => set({ currentSubject: subject, currentContentIndex: 0, courseContents: [], currentCourse: null }), // Reset index/content on subject change
      setCurrentCourse: (course) => set({ currentCourse: course, courseContents: course?.content || [] }),
      setCourseContents: (contents) => set({ courseContents: contents }),

      setCurrentContentIndex: (index, subject) => {
        const courseContent = get().courseContents; // Use courseContents directly
        if (!courseContent || index < 0 || index >= courseContent.length) {
          console.warn(`setCurrentContentIndex: Invalid index ${index} for subject ${subject}`);
          return;
        }
        if (!subject) {
           console.warn(`setCurrentContentIndex: Subject is missing.`);
           return;
        }

        set((state: AssessmentState) => {
          const progress = state.courseProgress || {};
          const currentSubjectProgress = progress[subject] || { currentTopic: 0, completedTopics: [] };
          const updatedSubjectProgress: SubjectProgress = {
            ...currentSubjectProgress,
            currentTopic: index,
          };
          console.log(`Auto-saving progress for ${subject}: Topic index ${index}`);
          return {
            currentContentIndex: index,
            courseProgress: {
              ...progress,
              [subject]: updatedSubjectProgress,
            },
          };
        });
      },

      loadSavedProgress: (subject) => {
        if (!subject) return false;
        const savedProgress = get().courseProgress?.[subject];
        if (savedProgress && typeof savedProgress.currentTopic === 'number') {
          const courseContent = get().courseContents; // Use courseContents
          if (courseContent && savedProgress.currentTopic >= 0 && savedProgress.currentTopic < courseContent.length) {
            console.log(`Loading saved progress for ${subject}: Topic index ${savedProgress.currentTopic}`);
            // Directly set index, auto-save will trigger via the set call inside this function
            get().setCurrentContentIndex(savedProgress.currentTopic, subject);
            // toast("Progress Restored", { description: `Resumed ${subject} at your last topic.` }); // Optional toast
            return true;
          } else {
            console.warn(`Saved progress index ${savedProgress.currentTopic} invalid for ${subject}. Resetting.`);
            get().setCurrentContentIndex(0, subject); // Reset to start if invalid
          }
        } else {
          console.log(`No valid saved progress found for ${subject}. Starting from beginning.`);
          if (get().currentContentIndex !== 0) {
             get().setCurrentContentIndex(0, subject); // Ensure start from 0 if no progress
          }
        }
        return false;
      },

      enrollInCourse: (courseId) => set((state) => ({
        enrolledCourses: state.enrolledCourses.includes(courseId)
          ? state.enrolledCourses
          : [...state.enrolledCourses, courseId],
      })),
      unenrollFromCourse: (courseId) => set((state) => ({
        enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
      })),

      markTopicCompleted: (subject, topicId) => {
        if (!subject) return;
        set((state: AssessmentState) => {
          const progress = state.courseProgress || {};
          const subjectProgress = progress[subject] || { currentTopic: state.currentContentIndex, completedTopics: [] };
          if (subjectProgress.completedTopics.includes(topicId)) return {}; // No change
          const updatedSubjectProgress: SubjectProgress = {
            ...subjectProgress,
            completedTopics: [...subjectProgress.completedTopics, topicId],
          };
          return {
            courseProgress: { ...progress, [subject]: updatedSubjectProgress },
          };
        });
      },

      saveTestScore: (subject, testId, score) => {
         if (!subject) return;
         set((state: AssessmentState) => {
           const progress = state.courseProgress || {};
           const subjectProgress = progress[subject] || { currentTopic: state.currentContentIndex, completedTopics: [] };
           const updatedSubjectProgress: SubjectProgress = {
             ...subjectProgress,
             testScores: { ...(subjectProgress.testScores || {}), [testId]: score },
           };
           return {
             courseProgress: { ...progress, [subject]: updatedSubjectProgress },
           };
         });
      },

      markAssessmentPassed: (subject, assessmentId) => {
         if (!subject) return;
         set((state: AssessmentState) => {
           const progress = state.courseProgress || {};
           const subjectProgress = progress[subject] || { currentTopic: state.currentContentIndex, completedTopics: [] };
           if (subjectProgress.passedAssessments?.includes(assessmentId)) return {}; // No change
           const updatedSubjectProgress: SubjectProgress = {
             ...subjectProgress,
             passedAssessments: [...(subjectProgress.passedAssessments || []), assessmentId],
           };
           return {
             courseProgress: { ...progress, [subject]: updatedSubjectProgress },
           };
         });
      },

      resetCourseContents: () => set({ courseContents: [], currentContentIndex: 0, currentCourse: null }),

      // Course Index Actions
      setShowCourseIndex: (show) => set({ showCourseIndex: show }),
      setCourseTopics: (topics) => set({ courseTopics: topics }),
      updateCourseTopic: (topicId, updates) => set((state) => ({
        courseTopics: state.courseTopics.map((topic) =>
          topic.id === topicId ? { ...topic, ...updates } : topic
        ),
      })),

      // Assessment Actions
      setAssessment: (assessment) => set({ assessment: assessment, currentQuestionIndex: 0, userAnswers: {} }), // Reset index/answers
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setUserAnswer: (questionId, answer) => set((state) => ({
        userAnswers: { ...state.userAnswers, [questionId]: answer },
      })),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setIsLoading: (isLoading) => set({ isLoading: isLoading }),
      setShowExplanationPanel: (show) => set({ showExplanationPanel: show }),
      setCurrentExplanation: (explanation) => set({ currentExplanation: explanation }),
      resetAssessment: () => set({ assessment: null, currentQuestionIndex: 0, userAnswers: {}, isPanelOpen: false, showExplanationPanel: false, currentExplanation: null }),
      hasPassedCurrentAssessment: (subject) => {
        if (!subject || !get().assessment) return false;
        const assessmentId = get().assessment!.id;
        return get().courseProgress?.[subject]?.passedAssessments?.includes(assessmentId) || false;
      },

      // Chat Actions
      addChatMessage: (role, content) => set((state) => ({ chatMessages: [...state.chatMessages, { role, content }] })),
      resetChat: () => set({ chatMessages: [] }),

      // Content Generation Actions
      setIsGeneratingContent: (isGenerating) => set({ isGeneratingContent: isGenerating }),

    }),
    {
      name: "learning-platform-storage",
      partialize: (state: AssessmentState) => ({
        userProfile: state.userProfile,
        courseProgress: state.courseProgress, // Persist the progress structure
        enrolledCourses: state.enrolledCourses,
        // Do NOT persist volatile state like current index, current course, chat messages etc.
      }),
    }
  )
)

// Define the combined StoreState type (using AssessmentState)
export type StoreState = AssessmentState;

