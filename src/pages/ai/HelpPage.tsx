import React from "react";
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Video, 
  FileQuestion,
  ExternalLink,
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

const faqItems = [
  {
    question: "How does the AI Academic Assistant work?",
    answer: "The AI Academic Assistant uses advanced natural language processing to understand your questions and provide answers based on your uploaded study materials. It can explain concepts, generate summaries, and help you prepare for exams using only approved academic content.",
  },
  {
    question: "What file formats are supported for upload?",
    answer: "We support PDF, PowerPoint (PPT/PPTX), Word documents (DOC/DOCX), and Excel files (XLS/XLSX). Files can be up to 50MB in size.",
  },
  {
    question: "Are my materials secure and private?",
    answer: "Yes, all uploaded materials are encrypted and stored securely. You control the visibility of your materials - they can be kept private or shared with the public library.",
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
  { title: "Getting Started Guide", description: "Learn the basics of using the AI features", icon: Book },
  { title: "Video Tutorials", description: "Watch step-by-step walkthroughs", icon: Video },
  { title: "FAQ", description: "Find answers to common questions", icon: FileQuestion },
  { title: "Contact Support", description: "Get help from our team", icon: Mail },
];

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          Help Center
          <HelpCircle className="w-6 h-6 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-2">
          Find answers and learn how to get the most out of the AI Academic Assistant
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          className="pl-10 h-12 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resourceLinks.map((link) => (
          <div
            key={link.title}
            className="ai-card border border-border p-5 hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
          >
            <link.icon className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground">{link.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
          </div>
        ))}
      </div>

      <div className="ai-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-secondary" />
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="ai-card-premium p-6 rounded-xl text-center">
        <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-secondary-foreground mb-2">
          Still need help?
        </h3>
        <p className="text-secondary-foreground/80 mb-4">
          Our support team is ready to assist you with any questions.
        </p>
        {/* @ts-ignore */}
        <Button variant="ai-primary" size="lg">
          <Mail className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default HelpPage;
