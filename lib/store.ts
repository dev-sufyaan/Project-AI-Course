import { create } from "zustand"
import { persist } from "zustand/middleware"

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

export interface CourseProgress {
  subject: string
  currentTopic: number
  completedTopics: string[]
  testScores: Record<string, number>
  needsReinforcement: string[]
  passedAssessments: string[] // Track which assessments the user has passed
}

// Course topic for the index
export interface CourseTopic {
  id: string
  title: string
  description: string
  completed: boolean
  order: number
}

interface AssessmentState {
  // User profile
  userProfile: UserProfile | null

  // Course and learning
  currentSubject: string | null
  courseContents: CourseContent[]
  currentContentIndex: number
  courseProgress: CourseProgress | null
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

  // Actions - User Profile
  setUserProfile: (profile: UserProfile) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  updateLearningPreferences: (preferences: Partial<LearningPreferences>) => void

  // Actions - Course
  setCurrentSubject: (subject: string | null) => void
  setCourseContents: (contents: CourseContent[]) => void
  setCurrentContentIndex: (index: number) => void
  updateCourseProgress: (progress: Partial<CourseProgress>) => void
  enrollInCourse: (courseId: string) => void
  markTopicCompleted: (topicTitle: string) => void
  saveTestScore: (testId: string, score: number) => void
  markAssessmentPassed: (assessmentId: string) => void
  resetCourseContents: () => void
  unenrollFromCourse: (courseId: string) => void
  saveCourseProgress: () => void
  loadSavedProgress: (subject: string) => boolean

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
  hasPassedCurrentAssessment: () => boolean

  // Actions - Chat
  addChatMessage: (role: "user" | "assistant", content: string) => void
  resetChat: () => void

  // Actions - Content Generation
  setIsGeneratingContent: (isGenerating: boolean) => void
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      // User profile
      userProfile: null,

      // Course and learning
      currentSubject: null,
      courseContents: [],
      currentContentIndex: 0,
      courseProgress: null,
      enrolledCourses: [],

      // Course index
      showCourseIndex: false,
      courseTopics: [],

      // Assessment
      assessment: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      isPanelOpen: false,
      isLoading: false,
      showExplanationPanel: false,
      currentExplanation: null,

      // Chat
      chatMessages: [],

      // Content generation status
      isGeneratingContent: false,

      // Actions - User Profile
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserProfile: (updates) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...updates }
            : // Initialize with defaults if null
              {
                id: updates.id || "guest-user-id", // Ensure ID is present
                learningPreferences: {
                  difficulty: "intermediate",
                  pacing: "standard",
                  explanationDetail: "balanced",
                  examplePreference: "moderate",
                  focusAreas: [],
                  customPreferences: "",
                },
                ...updates,
              },
        })),
      updateLearningPreferences: (preferences) =>
        set((state) => {
          if (!state.userProfile) {
            // Initialize profile if it doesn't exist when updating preferences
            return {
              userProfile: {
                id: "guest-user-id", // Default guest ID
                learningPreferences: {
                  difficulty: "intermediate",
                  pacing: "standard",
                  explanationDetail: "balanced",
                  examplePreference: "moderate",
                  focusAreas: [],
                  customPreferences: "",
                  ...preferences, // Apply incoming preferences
                },
              },
            }
          }

          return {
            userProfile: {
              ...state.userProfile,
              learningPreferences: {
                ...state.userProfile.learningPreferences,
                ...preferences,
              },
            },
          }
        }),

      // Actions - Course
      setCurrentSubject: (subject) => set({ currentSubject: subject }),
      setCourseContents: (contents) => set({ courseContents: contents }),
      setCurrentContentIndex: (index) => set({ currentContentIndex: index }),
      updateCourseProgress: (progress) =>
        set((state) => ({
          courseProgress: state.courseProgress
            ? { ...state.courseProgress, ...progress }
            : {
                subject: state.currentSubject || "",
                currentTopic: 0,
                completedTopics: [],
                testScores: {},
                needsReinforcement: [],
                passedAssessments: [],
                ...progress,
              },
        })),
      saveCourseProgress: () => 
        set((state) => {
          if (!state.currentSubject || state.courseContents.length === 0) return state;
          
          // Create a new progress object if one doesn't exist
          const existingProgress = state.courseProgress || {
            subject: state.currentSubject,
            completedTopics: [],
            testScores: {},
            needsReinforcement: [],
            passedAssessments: [],
            currentTopic: 0
          };
          
          // Ensure we're updating the correct subject's progress
          if (existingProgress.subject !== state.currentSubject) {
            // If subject has changed, create a new progress object
            return {
              courseProgress: {
                subject: state.currentSubject,
                currentTopic: state.currentContentIndex,
                completedTopics: [],
                testScores: {},
                needsReinforcement: [],
                passedAssessments: []
              }
            };
          }
          
          // Calculate completed topics from courseTopics if available
          const completedTopicTitles = state.courseTopics
            .filter(topic => topic.completed)
            .map(topic => topic.title);
          
          // Merge existing completed topics with ones from courseTopics
          const mergedCompletedTopics = Array.from(
            new Set([
              ...(existingProgress.completedTopics || []),
              ...completedTopicTitles
            ])
          );
          
          // Update the existing progress
          return {
            courseProgress: {
              ...existingProgress,
              currentTopic: state.currentContentIndex,
              completedTopics: mergedCompletedTopics
            }
          };
        }),
      loadSavedProgress: (subject) => {
        const state = get();
        
        // If no subject provided or no course contents, can't load progress
        if (!subject || state.courseContents.length === 0) {
          return false;
        }
        
        // Check if we have saved progress for this specific subject
        if (state.courseProgress?.subject === subject && 
            typeof state.courseProgress.currentTopic === 'number') {
          
          const savedIndex = state.courseProgress.currentTopic;
          
          // Ensure the saved index is valid (not beyond the course content length)
          const validIndex = Math.min(savedIndex, state.courseContents.length - 1);
          
          // Only update if the index is different from current to avoid unnecessary rerenders
          if (validIndex !== state.currentContentIndex) {
            set({ currentContentIndex: validIndex });
            return true;
          }
        }
        return false;
      },
      enrollInCourse: (courseId) =>
        set((state) => ({
          enrolledCourses: state.enrolledCourses.includes(courseId)
            ? state.enrolledCourses
            : [...state.enrolledCourses, courseId],
          courseProgress:
            state.courseProgress?.subject === courseId
              ? state.courseProgress
              : {
                  subject: courseId,
                  currentTopic: 0,
                  completedTopics: [],
                  testScores: {},
                  needsReinforcement: [],
                  passedAssessments: [],
                },
        })),
      markTopicCompleted: (topicTitle) =>
        set((state) => {
          if (!state.courseProgress || !state.currentSubject) return state

          const completedTopics = state.courseProgress.completedTopics || []
          if (!completedTopics.includes(topicTitle)) {
            return {
              courseProgress: {
                ...state.courseProgress,
                completedTopics: [...completedTopics, topicTitle],
              },
            }
          }
          return state
        }),
      saveTestScore: (testId, score) =>
        set((state) => {
          if (!state.courseProgress) return state

          return {
            courseProgress: {
              ...state.courseProgress,
              testScores: {
                ...(state.courseProgress.testScores || {}),
                [testId]: score,
              },
            },
          }
        }),
      markAssessmentPassed: (assessmentId) =>
        set((state) => {
          if (!state.courseProgress) return state

          const passedAssessments = state.courseProgress.passedAssessments || []
          if (!passedAssessments.includes(assessmentId)) {
            return {
              courseProgress: {
                ...state.courseProgress,
                passedAssessments: [...passedAssessments, assessmentId],
              },
            }
          }
          return state
        }),
      resetCourseContents: () =>
        set({
          courseContents: [],
          currentContentIndex: 0,
          assessment: null,
          currentQuestionIndex: 0,
          userAnswers: {},
          showExplanationPanel: false,
          currentExplanation: null,
        }),
      unenrollFromCourse: (courseId) =>
        set((state) => ({
          enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
          courseProgress: state.courseProgress?.subject === courseId ? null : state.courseProgress,
        })),

      // Actions - Course Index
      setShowCourseIndex: (show) => set({ showCourseIndex: show }),
      setCourseTopics: (topics) => set({ courseTopics: topics }),
      updateCourseTopic: (topicId, updates) =>
        set((state) => ({
          courseTopics: state.courseTopics.map((topic) => (topic.id === topicId ? { ...topic, ...updates } : topic)),
        })),

      // Actions - Assessment
      setAssessment: (assessment) => set({ assessment }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setUserAnswer: (questionId, answer) =>
        set((state) => ({
          userAnswers: {
            ...state.userAnswers,
            [questionId]: answer,
          },
        })),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setIsLoading: (isLoading) => set({ isLoading }),
      setShowExplanationPanel: (show) => set({ showExplanationPanel: show }),
      setCurrentExplanation: (explanation) => set({ currentExplanation: explanation }),
      resetAssessment: () =>
        set({
          assessment: null,
          currentQuestionIndex: 0,
          userAnswers: {},
          showExplanationPanel: false,
          currentExplanation: null,
        }),
      hasPassedCurrentAssessment: () => {
        const state = get()
        if (!state.assessment) return false

        const assessmentId = state.assessment.id
        const passedAssessments = state.courseProgress?.passedAssessments || []

        return passedAssessments.includes(assessmentId)
      },

      // Actions - Chat
      addChatMessage: (role, content) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, { role, content }],
        })),
      resetChat: () => set({ chatMessages: [] }),

      // Actions - Content Generation
      setIsGeneratingContent: (isGenerating) => set({ isGeneratingContent: isGenerating }),
    }),
    {
      name: "learning-platform-storage",
      partialize: (state) => ({
        userProfile: state.userProfile,
        courseProgress: state.courseProgress,
        enrolledCourses: state.enrolledCourses,
      }),
    },
  ),
)

