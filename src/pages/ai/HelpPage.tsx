import React from "react";
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  FileQuestion,
  Mail,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const faqItems = [
  {
    question: "How does the AI Academic Assistant work?",
    answer: "The AI Academic Assistant uses advanced natural language processing to understand your questions and provide answers based on your uploaded study materials. It can explain concepts, generate summaries, and help you prepare for exams using only approved academic content.",
  },
  {
    question: "What file formats are supported for upload?",
    answer: "For this MVP, we support PDF files only. Files can be up to 50MB in size.",
  },
  {
    question: "Are my materials secure and private?",
    answer: "Your uploaded materials are stored securely and are only used to provide AI responses in the app. Public sharing controls are not included in this MVP.",
  },
  {
    question: "How accurate are the AI-generated practice exams?",
    answer: "Practice exams are generated based strictly on your uploaded materials and approved content. All questions include references to the source material so you can verify accuracy.",
  },
  {
    question: "Can the AI help me cheat on exams?",
    answer: "No. The AI is designed to help you learn and prepare, not to provide answers during actual exams. All features are meant for study and practice purposes only.",
  },
];

const resourceLinks = [
  { title: "Getting Started", description: "Learn the basics", icon: Book },
  { title: "Video Tutorials", description: "Step-by-step guides", icon: Video },
  { title: "FAQ", description: "Common questions", icon: FileQuestion },
  { title: "Contact Support", description: "Get help", icon: Mail },
];

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground">Help Center</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find answers and learn how to use the AI Academic Assistant
        </p>
      </div>


      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          className="pl-10"
        />
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {resourceLinks.map((link) => (
          <Card
            key={link.title}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="pt-5 pb-4">
              <link.icon className="w-6 h-6 text-secondary mb-2" />
              <h3 className="font-medium text-sm text-foreground">{link.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center">
          <MessageCircle className="w-10 h-10 text-secondary mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-1">
            Still need help?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is ready to assist you.
          </p>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
