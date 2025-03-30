"use client"

import { useState } from "react"
import { MarkdownRenderer } from "../markdown-renderer"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// Example content in different languages
const exampleContent = {
  english: `
# Introduction to Python
Python is a high-level, interpreted programming language. It's known for its:
- Simple syntax
- Readability
- Versatility

## Basic Data Types
Python has several built-in data types, including:

\`\`\`python
# Integer
age = 30

# Float
price = 99.99

# String
name = "Alice"

# Boolean
is_active = True
\`\`\`

## Lists and Dictionaries
\`\`\`python
# List example
fruits = ["apple", "banana", "cherry"]

# Dictionary example
person = {"name": "Alice", "age": 30}
\`\`\`
  `,
  hindi: `
# पायथन का परिचय
पायथन एक उच्च-स्तरीय, व्याख्या की गई प्रोग्रामिंग भाषा है। यह इसके लिए जाना जाता है:
- सरल सिंटैक्स
- पठनीयता
- बहुमुखी प्रतिभा

## मूल डेटा प्रकार
पायथन में कई अंतर्निहित डेटा प्रकार हैं, जिनमें शामिल हैं:

\`\`\`python
# पूर्णांक (int)
उम्र = 30

# फ्लोटिंग-पॉइंट संख्याएँ (float)
कीमत = 99.99

# स्ट्रिंग (str)
नाम = "अलीस"

# बूलियन (bool)
सक्रिय_है = True
\`\`\`

## सूचियाँ और शब्दकोश
\`\`\`python
# सूची उदाहरण
फल = ["सेब", "केला", "चेरी"]

# शब्दकोश उदाहरण
व्यक्ति = {"नाम": "अलीस", "उम्र": 30}
\`\`\`
  `,
  arabic: `
# مقدمة في بايثون
بايثون هي لغة برمجة عالية المستوى ومفسرة. تشتهر بما يلي:
- بناء جملة بسيط
- سهولة القراءة
- تعدد الاستخدامات

## أنواع البيانات الأساسية
تحتوي بايثون على العديد من أنواع البيانات المدمجة، بما في ذلك:

\`\`\`python
# عدد صحيح
العمر = 30

# عدد عشري
السعر = 99.99

# سلسلة نصية
الاسم = "أليس"

# قيمة منطقية
نشط = True
\`\`\`

## القوائم والقواميس
\`\`\`python
# مثال قائمة
فواكه = ["تفاح", "موز", "كرز"]

# مثال قاموس
شخص = {"الاسم": "أليس", "العمر": 30}
\`\`\`
  `
}

export function MultilingualExample() {
  const [language, setLanguage] = useState<keyof typeof exampleContent>("english")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multilingual Markdown Example</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button 
            variant={language === "english" ? "default" : "outline"} 
            onClick={() => setLanguage("english")}
          >
            English
          </Button>
          <Button 
            variant={language === "hindi" ? "default" : "outline"} 
            onClick={() => setLanguage("hindi")}
          >
            हिन्दी (Hindi)
          </Button>
          <Button 
            variant={language === "arabic" ? "default" : "outline"} 
            onClick={() => setLanguage("arabic")}
          >
            العربية (Arabic)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer 
          content={exampleContent[language]} 
          dir={language === "arabic" ? "rtl" : "ltr"} 
        />
      </CardContent>
    </Card>
  )
} 