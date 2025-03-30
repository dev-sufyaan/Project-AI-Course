"use client"

import { useState, useEffect } from "react"
import { useAssessmentStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ProfileContentProps {
  user: {
    id: string
    firstName?: string | null
    lastName?: string | null
    fullName: string
    imageUrl?: string
    email: string
  }
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { userProfile, setUserProfile, updateLearningPreferences, courseProgress } = useAssessmentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [learningPreferences, setLearningPreferences] = useState({
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced",
    pacing: "standard" as "slow" | "standard" | "accelerated",
    focusAreas: [] as string[],
    explanationDetail: "balanced" as "concise" | "balanced" | "detailed",
    examplePreference: "moderate" as "minimal" | "moderate" | "extensive",
    customPreferences: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  // Initialize user profile if it doesn't exist
  useEffect(() => {
    if (!userProfile) {
      setUserProfile({
        id: user.id,
        learningPreferences: {
          difficulty: "intermediate",
          pacing: "standard",
          focusAreas: [],
          explanationDetail: "balanced",
          examplePreference: "moderate",
          customPreferences: "",
        },
      })
    } else {
      // Load existing preferences
      setLearningPreferences({
        difficulty: userProfile.learningPreferences.difficulty || "intermediate",
        pacing: userProfile.learningPreferences.pacing || "standard",
        focusAreas: userProfile.learningPreferences.focusAreas || [],
        explanationDetail: userProfile.learningPreferences.explanationDetail || "balanced",
        examplePreference: userProfile.learningPreferences.examplePreference || "moderate",
        customPreferences: userProfile.learningPreferences.customPreferences || "",
      })
    }
  }, [userProfile, user.id, setUserProfile])

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateLearningPreferences(learningPreferences)

      toast({
        title: "Learning preferences updated",
        description: "Your learning preferences have been saved.",
      })
    }
    setIsEditing(!isEditing)
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setLearningPreferences({
      ...learningPreferences,
      [key]: value,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{user.firstName?.charAt(0) || user.fullName.charAt(0) || "U"}</AvatarFallback>
              {user.imageUrl && <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />}
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.fullName || "User"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <Button onClick={handleEditToggle} variant="outline" className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
      </Card>

      <Tabs defaultValue="learning">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="learning">Learning Preferences</TabsTrigger>
          <TabsTrigger value="progress">Course Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="learning" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>Customize how content is presented to match your learning style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-8">
                  {/* Difficulty Level */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
                    <RadioGroup
                      value={learningPreferences.difficulty}
                      onValueChange={(value) => handlePreferenceChange("difficulty", value)}
                      disabled={!isEditing}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="difficulty-beginner" />
                        <Label htmlFor="difficulty-beginner" className="cursor-pointer">
                          Beginner
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="difficulty-intermediate" />
                        <Label htmlFor="difficulty-intermediate" className="cursor-pointer">
                          Intermediate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="difficulty-advanced" />
                        <Label htmlFor="difficulty-advanced" className="cursor-pointer">
                          Advanced
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Learning Pace */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Learning Pace</h3>
                    <RadioGroup
                      value={learningPreferences.pacing}
                      onValueChange={(value) => handlePreferenceChange("pacing", value)}
                      disabled={!isEditing}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" id="pace-slow" />
                        <Label htmlFor="pace-slow" className="cursor-pointer">
                          Gradual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="pace-standard" />
                        <Label htmlFor="pace-standard" className="cursor-pointer">
                          Standard
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="accelerated" id="pace-accelerated" />
                        <Label htmlFor="pace-accelerated" className="cursor-pointer">
                          Accelerated
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Explanation Detail */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Explanation Detail</h3>
                    <RadioGroup
                      value={learningPreferences.explanationDetail}
                      onValueChange={(value) => handlePreferenceChange("explanationDetail", value)}
                      disabled={!isEditing}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="detail-concise" />
                        <Label htmlFor="detail-concise" className="cursor-pointer">
                          Concise
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="balanced" id="detail-balanced" />
                        <Label htmlFor="detail-balanced" className="cursor-pointer">
                          Balanced
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detail-detailed" />
                        <Label htmlFor="detail-detailed" className="cursor-pointer">
                          Detailed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-8">
                  {/* Example Preference */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Example Preference</h3>
                    <RadioGroup
                      value={learningPreferences.examplePreference}
                      onValueChange={(value) => handlePreferenceChange("examplePreference", value)}
                      disabled={!isEditing}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="example-minimal" />
                        <Label htmlFor="example-minimal" className="cursor-pointer">
                          Minimal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="example-moderate" />
                        <Label htmlFor="example-moderate" className="cursor-pointer">
                          Moderate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="extensive" id="example-extensive" />
                        <Label htmlFor="example-extensive" className="cursor-pointer">
                          Extensive
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Custom Preferences */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Custom Learning Preferences</h3>
                    <p className="text-muted-foreground mb-4">
                      Describe any specific learning preferences or needs you have. Our AI will use this information to
                      personalize your learning experience.
                    </p>
                    <Textarea
                      placeholder="Example: I prefer connecting concepts to real-world applications. I understand better when concepts build gradually on each other. I like seeing the practical implications of what I'm learning."
                      value={learningPreferences.customPreferences}
                      onChange={(e) => handlePreferenceChange("customPreferences", e.target.value)}
                      disabled={!isEditing}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Track your learning journey across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {courseProgress ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Subject</h3>
                    <Badge className="text-base py-1.5 px-3">{courseProgress.subject}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Completed Topics</h3>
                    {courseProgress.completedTopics && courseProgress.completedTopics.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseProgress.completedTopics.map((topic, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No topics completed yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Test Scores</h3>
                    {Object.keys(courseProgress.testScores || {}).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(courseProgress.testScores || {}).map(([test, score], index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                            <span>{test}</span>
                            <Badge
                              variant={Number(score) >= 50 ? "default" : "outline"}
                              className={Number(score) >= 50 ? "bg-green-500" : ""}
                            >
                              {score}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No test scores yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Passed Assessments</h3>
                    {courseProgress.passedAssessments && courseProgress.passedAssessments.length > 0 ? (
                      <div className="space-y-3">
                        {courseProgress.passedAssessments.map((assessmentId, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-green-500/10 rounded-md">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{assessmentId.split("-").slice(0, 2).join(" - ")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No assessments passed yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't started any courses yet</p>
                  <Button onClick={() => router.push("/")}>Browse Courses</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

