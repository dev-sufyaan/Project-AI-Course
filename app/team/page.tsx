import { MainLayout } from "@/components/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const teamMembers = [
  {
    name: "Rahul Sharma",
    role: "Lead Developer",
    bio: "Full-stack developer with expertise in React, Next.js, and AI integration. Passionate about creating educational technology that makes a difference.",
    avatar: "/team/rahul.jpg",
    social: {
      github: "https://github.com/rahulsharma",
      linkedin: "https://linkedin.com/in/rahulsharma",
      twitter: "https://twitter.com/rahulsharma",
    },
  },
  {
    name: "Priya Patel",
    role: "AI Specialist",
    bio: "Machine learning engineer focused on natural language processing and educational applications of AI. Previously worked at leading AI research labs.",
    avatar: "/team/priya.jpg",
    social: {
      github: "https://github.com/priyapatel",
      linkedin: "https://linkedin.com/in/priyapatel",
      twitter: "https://twitter.com/priyapatel",
    },
  },
  {
    name: "Ahmed Khan",
    role: "Educational Content Lead",
    bio: "Former teacher with 10+ years of experience in curriculum development. Specializes in creating engaging, accessible educational content.",
    avatar: "/team/ahmed.jpg",
    social: {
      github: "https://github.com/ahmedkhan",
      linkedin: "https://linkedin.com/in/ahmedkhan",
      twitter: "https://twitter.com/ahmedkhan",
    },
  },
  {
    name: "Sophia Chen",
    role: "UX/UI Designer",
    bio: "Designer with a background in educational psychology. Creates intuitive, accessible interfaces that enhance the learning experience.",
    avatar: "/team/sophia.jpg",
    social: {
      github: "https://github.com/sophiachen",
      linkedin: "https://linkedin.com/in/sophiachen",
      twitter: "https://twitter.com/sophiachen",
    },
  },
]

export default function TeamPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-heading font-bold mb-2">Our Team</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Meet the passionate individuals behind our learning platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="h-24 w-24 border-2 border-primary/10">
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    <AvatarImage src={member.avatar} alt={member.name} />
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-medium">{member.name}</h2>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>

                    <div className="flex justify-center sm:justify-start space-x-2">
                      <Link href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Github className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-heading font-semibold mb-4">Join Our Team</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who are passionate about education and technology. If you're
            interested in joining our mission, check out our open positions.
          </p>
          <Button size="lg">View Open Positions</Button>
        </div>

        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-center">Our Advisors</h2>
          <p className="text-center text-muted-foreground mb-8">
            We're fortunate to have the guidance of experienced professionals in education and technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">Dr. Rajiv Mehta</h3>
                <p className="text-primary text-sm mb-2">Professor of Education, Delhi University</p>
                <p className="text-muted-foreground text-sm">
                  30+ years of experience in educational research and curriculum development
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarFallback>SG</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">Sunita Gupta</h3>
                <p className="text-primary text-sm mb-2">Former CTO, EdTech Innovations</p>
                <p className="text-muted-foreground text-sm">
                  Pioneer in educational technology with multiple successful startups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">Arjun Joshi</h3>
                <p className="text-primary text-sm mb-2">AI Research Scientist</p>
                <p className="text-muted-foreground text-sm">
                  Leading researcher in AI applications for personalized learning
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

