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
    question: "Si funksionon Asistenti Akademik AI?",
    answer: "Asistenti Akademik AI përdor përpunim të avancuar të gjuhës natyrore për të kuptuar pyetjet tuaja dhe për të dhënë përgjigje bazuar në materialet tuaja të ngarkuara. Ai mund të shpjegojë koncepte, të gjenerojë përmbledhje dhe t’ju ndihmojë të përgatiteni për provime duke përdorur vetëm përmbajtje akademike të aprovuar.",
  },
  {
    question: "Cilat formate skedarësh mbështeten për ngarkim?",
    answer: "Për këtë MVP, mbështeten vetëm skedarët PDF. Skedarët mund të jenë deri në 50MB.",
  },
  {
    question: "A janë materialet e mia të sigurta dhe private?",
    answer: "Materialet që ngarkoni ruhen në mënyrë të sigurt dhe përdoren vetëm për të ofruar përgjigje nga AI brenda aplikacionit. Kontrolli i shpërndarjes publike nuk është i përfshirë në këtë MVP.",
  },
  {
    question: "Sa të sakta janë provimet praktike të gjeneruara nga AI?",
    answer: "Provimet praktike gjenerohen strikt bazuar në materialet tuaja të ngarkuara dhe në përmbajtje të aprovuar. Të gjitha pyetjet përfshijnë referenca te materiali burim që të mund ta verifikoni saktësinë.",
  },
  {
    question: "A mund të më ndihmojë AI të kopjoj në provime?",
    answer: "Jo. AI është dizajnuar për t’ju ndihmuar të mësoni dhe të përgatiteni, jo për t’ju dhënë përgjigje gjatë provimeve reale. Të gjitha veçoritë janë vetëm për studim dhe praktikë.",
  },
];

const resourceLinks = [
  { title: "Nisja", description: "Mëso bazat", icon: Book },
  { title: "Tutoriale me video", description: "Udhëzime hap pas hapi", icon: Video },
  { title: "Pyetje të shpeshta", description: "Pyetje të zakonshme", icon: FileQuestion },
  { title: "Kontakto mbështetjen", description: "Merr ndihmë", icon: Mail },
];

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground">Qendra e Ndihmës</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gjeni përgjigje dhe mësoni si të përdorni Asistentin Akademik AI
        </p>
      </div>


      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Kërko ndihmë..."
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
          <CardTitle className="text-base font-medium">Pyetje të shpeshta</CardTitle>
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
            Ende keni nevojë për ndihmë?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ekipi ynë i mbështetjes është gati t’ju ndihmojë.
          </p>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Kontakto mbështetjen
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
