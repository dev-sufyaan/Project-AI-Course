import { MainLayout } from "@/components/main-layout"
import { CoursesList } from "@/components/courses/courses-list"

export default function CoursesPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6">Available Courses</h1>
        <CoursesList />
      </div>
    </MainLayout>
  )
}

