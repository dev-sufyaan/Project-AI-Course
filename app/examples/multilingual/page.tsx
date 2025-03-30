import { MultilingualExample } from "@/components/examples/multilingual-example"

export default function MultilingualPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Multilingual Markdown Rendering</h1>
      <p className="text-muted-foreground mb-8">
        This example demonstrates consistent markdown styling across multiple languages including English, Hindi, and Arabic.
        The MarkdownRenderer component handles RTL languages, code blocks, and various markdown elements with proper styling.
      </p>
      <MultilingualExample />
    </div>
  )
} 