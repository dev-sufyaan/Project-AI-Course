"use client"

import { useEffect, useState } from "react"
import { useAssessmentStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, BookOpen, List, Save, Check, Home } from "lucide-react"
import { AssessmentPanel } from "../assessment/assessment-panel"
import { CourseIndex } from "./course-index"
import { MarkdownRenderer } from "../markdown-renderer"
import { useToast } from "@/components/ui/use-toast"
import { LearningAssistant } from "./learning-assistant"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface CourseContentProps {
  subject: string
}

// Predefined topics for Python course
const pythonTopics = [
  // Module 1: Getting Started with Python
  "What is Python & Why Learn It?",
  "Setting Up Your Python Environment",
  "Choosing and Setting Up an IDE/Editor",
  "Your First Python Code: \"Hello, World!\"",
  "Understanding Python Syntax and Indentation",
  "Writing Comments in Python",
  // Module 2: Python Core Concepts: Variables & Basic Data Types
  "Introduction to Variables",
  "Introduction to Data Types",
  "Numerical Type: Integers (int)",
  "Numerical Type: Floating-Point Numbers (float)",
  "Basic Arithmetic Operators",
  "String (str): Fundamentals",
  "String Concatenation and Repetition",
  "Getting User Input with input()",
  "Type Conversion (Casting)",
  "String Formatting: f-Strings",
  "Boolean Type (bool)",
  "Comparison Operators",
  "The None Type",
  // Module 3: Control Flow: Making Decisions and Repeating Code
  "Logical Operators (and, or, not)",
  "Conditional Statements: if",
  "Conditional Statements: else",
  "Conditional Statements: elif",
  "Introduction to Loops: Why Repeat?",
  "while Loops",
  "for Loops and Iterables",
  "The range() Function",
  "Loop Control: break Statement",
  "Loop Control: continue Statement",
  "Loop else Clause",
  // Module 4: Data Structures: Collections of Data
  "Introduction to Data Structures",
  "Lists (list): Fundamentals",
  "List Indexing and Slicing",
  "Modifying Lists: Mutability",
  "Common List Methods",
  "Looping Through Lists",
  "Introduction to List Comprehensions",
  "Tuples (tuple): Fundamentals",
  "Tuple Use Cases and Unpacking",
  "Dictionaries (dict): Fundamentals",
  "Accessing and Modifying Dictionary Items",
  "Common Dictionary Methods",
  "Looping Through Dictionaries",
  "Introduction to Dictionary Comprehensions",
  "Sets (set): Fundamentals",
  "Set Operations",
  // Module 5: Functions: Reusable Code Blocks
  "Introduction to Functions: DRY Principle",
  "Defining Functions with def",
  "Function Arguments (Parameters)",
  "Return Values with return",
  "Positional and Keyword Arguments",
  "Default Argument Values",
  "Variable Scope: Local vs. Global",
  "Docstrings: Documenting Functions",
  "Anonymous Functions: lambda",
  // Module 6: Intermediate Python: Modules, Exceptions, Files
  "Introduction to Modules",
  "Importing Modules: import and from...import",
  "Exploring the Python Standard Library (Examples: math, random)",
  "Creating Your Own Modules",
  "Introduction to Packages",
  "Introduction to Errors and Exceptions",
  "Handling Exceptions: try...except Blocks",
  "Handling Specific vs. General Exceptions",
  "The else and finally Clauses in try Blocks",
  "Raising Exceptions with raise",
  "Introduction to File Handling",
  "Reading from Files ('r' mode)",
  "Writing to Files ('w', 'a' modes)",
  "Context Managers: with open(...)",
  "Working with File Paths (os and pathlib)",
  // Module 7: Object-Oriented Programming (OOP)
  "Introduction to OOP Concepts",
  "Defining Classes with class",
  "Creating Objects (Instances)",
  "Instance Attributes and the __init__ Method",
  "Instance Methods",
  "Understanding self",
  "Class Attributes",
  "Encapsulation: Public, Protected, and Private",
  "Introduction to Inheritance",
  "Creating Subclasses",
  "Overriding Methods and the super() Function",
  "Introduction to Polymorphism",
  "Special Methods (Dunder Methods)",
  // Module 8: Advanced Python Concepts
  "More List Comprehensions (with if)",
  "Set and Dictionary Comprehensions Revisited",
  "Generators: Introduction and yield",
  "Generator Expressions",
  "Decorators: Introduction",
  "Creating and Using Simple Decorators",
  "Working with *args and **kwargs",
  "Regular Expressions (re module): Basics",
  "Working with Dates and Times (datetime module)",
  "Working with JSON Data (json module)",
  "Introduction to Virtual Environments (venv)",
  "Managing Packages with pip",
  // Module 9: Best Practices, Testing, and Next Steps
  "Writing Clean Code: PEP 8 Style Guide",
  "Debugging Techniques",
  "Introduction to Testing: Why Test?",
  "Basic Unit Testing (unittest or pytest)",
  "Version Control with Git: Basics",
  "Where to Go Next? Specializations"
];

// Predefined topics for Web Development course
const webDevTopics = [
  // Module 1: Introduction to Web Development
  "What is Web Development?",
  "How Websites Work (Client, Server, HTTP)",
  "Core Technologies Overview (HTML, CSS, JS Roles)",
  "Setting Up Your Development Environment (Browser, Code Editor)",
  "Using Browser Developer Tools (Inspector, Console Basics)",
  // Module 2: HTML Fundamentals: Structuring Web Content
  "What is HTML?",
  "Basic HTML Document Structure (<!DOCTYPE>, <html>, <head>, <body>)",
  "Headings (<h1> to <h6>)",
  "Paragraphs (<p>)",
  "Line Breaks (<br>) and Horizontal Rules (<hr>)",
  "Text Formatting: Bold (<strong>) and Italic (<em>)",
  "Comments in HTML (<!-- -->)",
  "Introduction to Attributes (e.g., id, class)",
  "Unordered Lists (<ul>, <li>)",
  "Ordered Lists (<ol>, <li>)",
  "Creating Links (<a> tag, href attribute)",
  "Absolute vs. Relative URLs",
  "Linking Within a Page (Fragment Identifiers #)",
  "Adding Images (<img> tag, src, alt attributes)",
  "Understanding File Paths for Links and Images",
  "Basic Table Structure (<table>, <tr>, <th>, <td>)",
  "Table Headers and Body (<thead>, <tbody>)",
  "Introduction to HTML Forms (<form> tag)",
  "Text Input Fields (<input type=\"text\">, <input type=\"password\">)",
  "Labels for Inputs (<label>)",
  "Radio Buttons (<input type=\"radio\">)",
  "Checkboxes (<input type=\"checkbox\">)",
  "Submit Buttons (<input type=\"submit\">, <button type=\"submit\">)",
  "Text Areas (<textarea>)",
  "Dropdown Select Boxes (<select>, <option>)",
  "Introduction to Semantic HTML",
  "Structural Elements (<header>, <footer>, <nav>, <main>)",
  "Content Sectioning Elements (<article>, <section>, <aside>)",
  "Inline vs. Block Level Elements",
  "Grouping Content (<div>, <span>)",
  "HTML Entities (e.g., &copy;, &lt;, &gt;)",
  "Embedding Audio (<audio>)",
  "Embedding Video (<video>)",
  "Basic Web Accessibility Concepts (alt text review, semantic meaning)",
  // Module 3: CSS Fundamentals: Styling Web Pages
  "What is CSS?",
  "Ways to Add CSS (Inline, Internal <style>, External <link>)",
  "Basic CSS Syntax (Selector { Property: Value; })",
  "Element Selectors (e.g., p, h1, div)",
  "Class Selectors (.classname)",
  "ID Selectors (#idname)",
  "Grouping Selectors (,)",
  "Descendant Combinator (space)",
  "Child Combinator (>)",
  "Adjacent Sibling Combinator (+)",
  "General Sibling Combinator (~)",
  "Comments in CSS (/* */)",
  "Styling Text: color Property",
  "Styling Text: font-family Property",
  "Styling Text: font-size Property",
  "Styling Text: font-weight Property",
  "Styling Text: text-align Property",
  "Styling Text: text-decoration Property",
  "Backgrounds: background-color Property",
  "Backgrounds: background-image Property",
  "Introduction to the Box Model (Content, Padding, Border, Margin)",
  "Setting width and height",
  "Padding Properties (padding, -top, -right, -bottom, -left)",
  "Border Properties (border, -width, -style, -color)",
  "Margin Properties (margin, -top, -right, -bottom, -left)",
  "box-sizing: border-box",
  "Understanding CSS Specificity",
  "Inheritance in CSS",
  "Pseudo-classes (:hover, :focus, :active)",
  "Structural Pseudo-classes (:first-child, :last-child, :nth-child())",
  "Pseudo-elements (::before, ::after)",
  "Attribute Selectors ([attribute], [attribute=value])",
  "The display Property (block, inline, inline-block, none)",
  "The visibility Property",
  // Module 4: CSS Layout Techniques
  "CSS Positioning: static (Default)",
  "CSS Positioning: relative",
  "CSS Positioning: absolute",
  "CSS Positioning: fixed",
  "CSS Positioning: sticky",
  "The z-index Property",
  "Floating Elements (float: left/right) (Legacy Concept)",
  "Clearing Floats (clear: both) (Legacy Concept)",
  "Introduction to Flexbox Layout (display: flex)",
  "Flex Container Properties: flex-direction",
  "Flex Container Properties: justify-content",
  "Flex Container Properties: align-items",
  "Flex Container Properties: flex-wrap",
  "Flex Item Properties: flex-grow, flex-shrink, flex-basis",
  "Flex Item Properties: order",
  "Flex Item Properties: align-self",
  "Introduction to Grid Layout (display: grid)",
  "Defining Grid Columns (grid-template-columns)",
  "Defining Grid Rows (grid-template-rows)",
  "Creating Gutters (gap, column-gap, row-gap)",
  "Placing Items in Grid (grid-column, grid-row)",
  "Spanning Grid Items",
  // Module 5: Responsive Design and Advanced CSS
  "Introduction to Responsive Web Design",
  "The Viewport Meta Tag (<meta name=\"viewport\">)",
  "Using Media Queries (@media)",
  "Common Breakpoints",
  "Mobile-First Design Approach",
  "Relative Units: Percentages (%)",
  "Relative Units: em and rem",
  "Viewport Units: vw and vh",
  "Responsive Images (e.g., max-width: 100%)",
  "CSS Transitions (transition property)",
  "CSS Animations (@keyframes, animation property)",
  "CSS Variables (Custom Properties) (--var, var())",
  "Introduction to CSS Preprocessors (Concept - Sass/LESS)",
  "Introduction to CSS Frameworks (Concept - Bootstrap/Tailwind)",
  // Module 6: JavaScript Fundamentals: Making Web Pages Interactive
  "What is JavaScript?",
  "Adding JavaScript to HTML (<script> tag - internal vs external)",
  "The Browser Console (console.log())",
  "Comments in JavaScript (//, /* */)",
  "Introduction to Variables (var - historical, let, const)",
  "JavaScript Data Types: Overview",
  "Data Type: Numbers",
  "Data Type: Strings (Concatenation, Properties, Methods)",
  "Data Type: Booleans",
  "Data Type: Null and Undefined",
  "Basic Operators: Arithmetic (+, -, *, /, %, **)",
  "Basic Operators: Assignment (=, +=, -=, etc.)",
  "Basic Operators: Comparison (==, ===, !=, !==, >, <, >=, <=)",
  "Basic Operators: Logical (&&, ||, !)",
  "Type Coercion Basics",
  "Conditional Statements: if, else if, else",
  "Conditional Statements: switch",
  "Ternary Operator (condition ? exprIfTrue : exprIfFalse)",
  "Introduction to Functions (Declaration)",
  "Function Parameters and Arguments",
  "Function Return Values (return)",
  "Function Expressions",
  "Variable Scope (Global, Function, Block)",
  "Introduction to Arrays",
  "Accessing Array Elements (Indexing)",
  "Common Array Methods (push, pop, shift, unshift)",
  "Common Array Methods (slice, splice)",
  "Introduction to Objects (Literals)",
  "Accessing Object Properties (Dot Notation, Bracket Notation)",
  "Modifying Object Properties",
  "for Loops",
  "while Loops",
  "Looping Through Arrays (for loop, forEach)",
  // Module 7: JavaScript and the DOM (Document Object Model)
  "What is the DOM?",
  "Selecting Elements: getElementById()",
  "Selecting Elements: getElementsByClassName()",
  "Selecting Elements: getElementsByTagName()",
  "Selecting Elements: querySelector() (Single Element)",
  "Selecting Elements: querySelectorAll() (NodeList)",
  "Traversing the DOM: Parent (parentElement)",
  "Traversing the DOM: Children (children)",
  "Traversing the DOM: Siblings (nextElementSibling, previousElementSibling)",
  "Modifying Element Content: textContent",
  "Modifying Element Content: innerHTML (Use with Caution)",
  "Modifying Element Attributes: getAttribute(), setAttribute()",
  "Modifying Element Styles (element.style property)",
  "Modifying CSS Classes (element.classList.add(), .remove(), .toggle())",
  "Creating New Elements (createElement())",
  "Adding Elements to the DOM (appendChild(), insertBefore())",
  "Removing Elements from the DOM (removeChild())",
  "Introduction to Browser Events",
  "Adding Event Listeners (addEventListener())",
  "Common Event Types: click, mouseover, mouseout",
  "Common Event Types: keydown, keyup",
  "Common Event Types: submit (Form Events)",
  "Common Event Types: load, DOMContentLoaded",
  "The Event Object",
  "Preventing Default Behavior (event.preventDefault())",
  "Event Bubbling and Capturing (Concept)",
  // Module 8: Intermediate and Asynchronous JavaScript
  "Understanding this Keyword (Basic Global/Function Context)",
  "Arrow Functions (=>)",
  "Template Literals (Backticks ``)",
  "Array Helper Methods: map()",
  "Array Helper Methods: filter()",
  "Array Helper Methods: reduce() (Optional/Advanced)",
  "Destructuring Assignment (Arrays and Objects)",
  "Spread (...) and Rest (...) Operators",
  "Introduction to Asynchronous JavaScript",
  "Callbacks (Concept and Basic Usage)",
  "Introduction to Promises (.then(), .catch())",
  "Using async and await",
  "Making HTTP Requests with fetch() API",
  "Working with JSON Data (JSON.parse(), JSON.stringify())",
  "Handling fetch Errors",
  "Browser Storage: localStorage",
  "Browser Storage: sessionStorage",
  "JavaScript Modules (import/export) (Concept)",
  // Module 9: Development Workflow and Next Steps
  "Further Browser Developer Tools Usage (Debugging JS)",
  "Introduction to Version Control with Git (init, add, commit, status)",
  "Working with Remote Repositories (GitHub/GitLab Basics: clone, push, pull)",
  "Code Quality and Linting (Concept - e.g., ESLint, Prettier)",
  "Web Accessibility (A11y) Best Practices Review",
  "Basic Web Performance Considerations (Image Optimization, Minification Concept)",
  "Introduction to Frontend Frameworks/Libraries (React, Vue, Angular - Overview)",
  "Introduction to Backend Development (Node.js, Python/Django/Flask - Overview)",
  "Where to Go Next? Specializations"
];

// Get predefined topics based on subject
const getPredefinedTopics = (subject: string) => {
  console.log("Getting predefined topics for subject:", subject);
  
  // Normalize the subject name to handle URL slugs
  const normalizedSubject = subject.toLowerCase().replace(/-/g, '_');
  
  if (normalizedSubject === "python") {
    console.log(`Found ${pythonTopics.length} Python topics`);
    return pythonTopics;
  } else if (normalizedSubject === "web_development" || normalizedSubject === "web-development") {
    console.log(`Found ${webDevTopics.length} Web Development topics`);
    return webDevTopics;
  }
  
  console.log("No predefined topics found for subject:", subject);
  return [];
};

export function CourseContent({ subject }: CourseContentProps) {
  const {
    userProfile,
    courseContents,
    currentContentIndex,
    setCurrentContentIndex,
    setCourseContents,
    togglePanel,
    isPanelOpen,
    isGeneratingContent,
    setIsGeneratingContent,
    assessment,
    resetAssessment,
    hasPassedCurrentAssessment,
    setShowCourseIndex,
    setCourseTopics,
    courseTopics,
    saveCourseProgress,
    loadSavedProgress,
    resetCourseContents,
    markTopicCompleted,
    updateCourseTopic,
    courseProgress,
    updateCourseProgress,
  } = useAssessmentStore()

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [saveIndicator, setSaveIndicator] = useState(false)
  const { toast } = useToast()

  // Track if we need to regenerate content when leaving/returning to the page
  const [shouldRegenerateOnReturn, setShouldRegenerateOnReturn] = useState(false);
  const [previousSubject, setPreviousSubject] = useState<string | null>(null);
  
  // Store the current URL path to detect navigation changes
  const [currentPath, setCurrentPath] = useState("");
  
  // Effect to detect navigation away from the page
  useEffect(() => {
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      
      // If we're navigating away from the current course
      if (currentPath.includes(`/learn/${subject}`) && !newPath.includes(`/learn/${subject}`)) {
        setShouldRegenerateOnReturn(true);
        setPreviousSubject(subject);
      }
      
      setCurrentPath(newPath);
    };
    
    // Set initial path
    setCurrentPath(window.location.pathname);
    
    // Add listener for navigation
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [subject, currentPath]);

  // Effect to check if we need to regenerate content when returning to the page
  useEffect(() => {
    // If subject changed (switched courses) or returning to the page
    if ((previousSubject && previousSubject !== subject) || 
        (shouldRegenerateOnReturn && currentPath.includes(`/learn/${subject}`))) {
      // Reset the flags
      setShouldRegenerateOnReturn(false);
      setPreviousSubject(subject);
      
      // Reset course contents and regenerate
      resetCourseContents();
      resetAssessment();
      
      // Clear course topics too to ensure they are regenerated for new subject
      setCourseTopics([]);
    }
  }, [shouldRegenerateOnReturn, currentPath, subject, resetCourseContents, previousSubject, resetAssessment, setCourseTopics]);

  // This effect runs when the subject changes directly (e.g., direct navigation)
  useEffect(() => {
    if (previousSubject && previousSubject !== subject) {
      // Reset course contents and regenerate
      resetCourseContents();
      resetAssessment();
      setCourseTopics([]);
      setPreviousSubject(subject);
    }
  }, [subject, previousSubject, resetCourseContents, resetAssessment, setCourseTopics]);

  // Generate course topics for index
  useEffect(() => {
    // Ensure we always set up predefined topics for the index
    const setupPredefinedTopics = () => {
      if (courseTopics.length === 0 && subject) {
        // Get all predefined topics for this subject
        const predefinedTopics = getPredefinedTopics(subject);
        
        if (predefinedTopics.length > 0) {
          console.log(`Setting up ${predefinedTopics.length} predefined topics for index`);
          const topicsForIndex = predefinedTopics.map((title, index) => ({
            id: `${subject}-${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${index}`,
            title,
            description: `Learn about ${title} in this comprehensive lesson.`,
            completed: index < currentContentIndex,
            order: index + 1,
          }));
          setCourseTopics(topicsForIndex);
        }
      }
    };
    
    // Call immediately to ensure topics are set up
    setupPredefinedTopics();
    
    // Generate initial content if none exists
    const generateInitialContent = async () => {
      if (courseContents.length === 0 && !isGeneratingContent) {
        setIsGeneratingContent(true)

        try {
          // Get predefined topics for this subject
          const topics = getPredefinedTopics(subject);
          
          // Use the first topic or a default
          const firstTopic = topics.length > 0 
            ? topics[0] 
            : `Introduction to ${subject}`;

          // Generate introduction content
          const response = await fetch("/api/gemini/generateContent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject,
              topic: firstTopic,
              userProfile: userProfile || {
                learningPreferences: {
                  difficulty: "intermediate",
                  learningStyle: "text",
                  language: "english",
                },
              },
              previousContent: null,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to generate content")
          }

          const data = await response.json()
          setCourseContents([data.courseContent])
        } catch (error) {
          console.error("Error generating initial content:", error)
          toast({
            title: "Error",
            description: "Failed to generate course content. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsGeneratingContent(false)
          setIsInitialLoad(false)
        }
      } else {
        setIsInitialLoad(false)
      }
    }

    generateInitialContent()
    
    // Load saved progress function
    const loadSavedProgressData = () => {
      if (subject && courseContents.length > 0) {
        // Try to load saved progress for this subject
        const progressLoaded = loadSavedProgress(subject);
        
        if (progressLoaded) {
          toast({
            title: "Progress Restored",
            description: "Your previous progress has been restored.",
            duration: 3000,
          });
        }
      }
    };
    
    // Load saved progress after content is loaded
    if (courseContents.length > 0) {
      loadSavedProgressData();
    }
  }, [
    subject,
    userProfile,
    courseContents.length,
    courseContents,
    isGeneratingContent,
    setCourseContents,
    setIsGeneratingContent,
    toast,
    setCourseTopics,
    loadSavedProgress,
    courseTopics,
    courseTopics.length,
    currentContentIndex,
  ])

  const currentContent = courseContents[currentContentIndex]

  const handleSaveProgress = () => {
    // Save the current progress
    saveCourseProgress();
    
    // Show visual indicator that progress was saved
    setSaveIndicator(true);
    
    // Show toast notification
    toast({
      title: "Progress Saved",
      description: `Your progress for ${subject} has been saved. You can continue from this point later.`,
      duration: 3000,
    });
    
    // Reset the checkmark indicator after 3 seconds
    setTimeout(() => {
      setSaveIndicator(false);
    }, 3000);
  };

  const handleMarkComplete = () => {
    // If there's a current topic
    if (currentContent) {
      const topicTitle = currentContent.title;
      
      // Mark the topic as completed in the store
      markTopicCompleted(topicTitle);
      
      // Update the course topic in the index as completed
      const currentTopic = courseTopics.find(topic => topic.title === topicTitle);
      if (currentTopic) {
        updateCourseTopic(currentTopic.id, { completed: true });
      }
      
      // Show toast notification
      toast({
        title: "Topic Completed",
        description: `You've marked "${topicTitle}" as complete.`,
        duration: 3000,
      });
    }
  };

  const handleNextContent = async () => {
    // Check if user has attempted the current assessment
    if (!assessment) {
      // User hasn't attempted the assessment yet
      toast({
        title: "Assessment Required",
        description: "You need to complete the assessment before moving to the next topic.",
        variant: "destructive",
      })

      // Open assessment panel
      togglePanel()
      return;
    }

    // Check if user has passed the current assessment
    if (!hasPassedCurrentAssessment()) {
      toast({
        title: "Assessment Not Passed",
        description: "You need to pass the assessment before moving to the next topic.",
        variant: "destructive",
      })

      // Open assessment panel if not already open
      if (!isPanelOpen) {
        togglePanel()
      }

      return;
    }

    // Mark the current topic as completed if it's not already
    if (currentContent) {
      const topicTitle = currentContent.title;
      const currentTopicInList = courseTopics.find(topic => topic.title === topicTitle);
      
      if (currentTopicInList && !currentTopicInList.completed) {
        // Mark topic as completed in store
        markTopicCompleted(topicTitle);
        
        // Update course topic in the index
        updateCourseTopic(currentTopicInList.id, { completed: true });
        
        // Update course progress with current completion status
        const completedTopics = courseProgress?.completedTopics || [];
        if (!completedTopics.includes(topicTitle)) {
          updateCourseProgress({
            completedTopics: [...completedTopics, topicTitle],
            currentTopic: currentContentIndex + 1
          });
        }
      }
    }

    // If we're at the end of the content, generate new content
    if (currentContentIndex === courseContents.length - 1) {
      setIsGeneratingContent(true)

      try {
        // Get predefined topics
        const predefinedTopics = getPredefinedTopics(subject);
        
        // If we have predefined topics and haven't exhausted them yet
        let nextTopic = `Next topic in ${subject}`;
        if (predefinedTopics.length > 0 && currentContentIndex + 1 < predefinedTopics.length) {
          nextTopic = predefinedTopics[currentContentIndex + 1];
        }

        // Generate next content
        const response = await fetch("/api/gemini/generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            topic: nextTopic,
            userProfile: userProfile || {
              learningPreferences: {
                difficulty: "intermediate",
                learningStyle: "text",
                language: "english",
              },
            },
            previousContent: currentContent,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate content")
        }

        const data = await response.json()
        const newContent = data.courseContent;
        
        // Add the new content to course contents
        setCourseContents([...courseContents, newContent])
        
        // Add the new content to course topics if it doesn't exist
        const topicExists = courseTopics.some(topic => topic.title === newContent.title);
        if (!topicExists) {
          const newTopic = {
            id: `topic-${Date.now()}`,
            title: newContent.title,
            description: newContent.content.substring(0, 100) + '...',
            completed: false,
            order: courseTopics.length
          };
          
          setCourseTopics([...courseTopics, newTopic]);
        }
        
        // Move to the next content index
        setCurrentContentIndex(currentContentIndex + 1)
        
        // Update course progress
        updateCourseProgress({
          currentTopic: currentContentIndex + 1
        });
        
        // Save progress
        saveCourseProgress();

        // Reset assessment when moving to new content
        resetAssessment()
        
        toast({
          title: "Next Topic Loaded",
          description: `You are now viewing "${newContent.title}"`,
          duration: 3000,
        });
      } catch (error) {
        console.error("Error generating next content:", error)
        toast({
          title: "Error",
          description: "Failed to generate next topic. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsGeneratingContent(false)
      }
    } else {
      // Move to next existing content
      setCurrentContentIndex(currentContentIndex + 1)
      
      // Update course progress with next topic index
      updateCourseProgress({
        currentTopic: currentContentIndex + 1
      });
      
      // Save progress
      saveCourseProgress();
      
      toast({
        title: "Next Topic Loaded",
        description: `You are now viewing "${courseContents[currentContentIndex + 1]?.title || 'next topic'}"`,
        duration: 3000,
      });

      // Reset assessment when moving to different content
      resetAssessment()
    }
  }

  const handlePreviousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)

      // Reset assessment when moving to different content
      resetAssessment()
    }
  }

  const handleOpenIndex = () => {
    setShowCourseIndex(true)
  }

  if (isInitialLoad || (courseContents.length === 0 && isGeneratingContent)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2 mt-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2 mt-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!currentContent) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No content available. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">{currentContent.title}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveProgress}
            className="flex items-center gap-2"
            disabled={saveIndicator}
          >
            {saveIndicator ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Progress
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleMarkComplete} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Mark as Complete
          </Button>
          <Button variant="outline" onClick={handleOpenIndex} className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Course Index
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <div>
            <h3 className="text-lg font-medium">Course Progress</h3>
            <p className="text-sm text-muted-foreground">
              {courseTopics.filter((topic) => topic.completed).length} of {courseTopics.length} topics completed
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {Math.round((courseTopics.filter((topic) => topic.completed).length / Math.max(courseTopics.length, 1)) * 100)}%
            </span>
          </div>
          <Progress 
            value={(courseTopics.filter((topic) => topic.completed).length / Math.max(courseTopics.length, 1)) * 100} 
            className="h-2" 
          />
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none course-content">
        <MarkdownRenderer content={currentContent.content} />
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePreviousContent}
          disabled={currentContentIndex === 0 || isGeneratingContent}
        >
          Previous
        </Button>

        <div className="flex gap-4">
          {!isPanelOpen && (
            <Button onClick={togglePanel} className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Take Assessment
            </Button>
          )}

          <Button onClick={handleNextContent} disabled={isGeneratingContent} className="flex items-center gap-2">
            {isGeneratingContent ? "Generating..." : "Next Topic"}
            {!isGeneratingContent && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AssessmentPanel />
      <CourseIndex />
      <LearningAssistant />
    </div>
  )
}

