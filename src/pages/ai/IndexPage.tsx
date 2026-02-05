import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  FileText,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Asistenti Akademik AI",
    description: "Bëni pyetje mbi materialet tuaja të studimit me gjuhë natyrore dhe merrni përgjigje të shpejta e të sakta.",
  },
  {
    icon: FileText,
    title: "Përmbledhje inteligjente",
    description: "Gjeneroni përmbledhje të shkurtra të leksioneve, slajdeve dhe leximeve brenda sekondash.",
  },
  {
    icon: GraduationCap,
    title: "Motori i Provimeve",
    description: "Krijoni provime praktike bazuar në materialet e lëndës për t’u përgatitur më mirë.",
  },
  {
    icon: Brain,
    title: "Këshilltar personal",
    description: "Merrni rekomandime të personalizuara për studim bazuar në performancën dhe objektivat tuaja.",
  },
];

const benefits = [
  "Qasje 24/7 në mjete studimi të fuqizuara nga AI",
  "Studioni më zgjuar me rekomandime të personalizuara",
  "Praktikoni me provime të gjeneruara nga materialet tuaja",
  "Ndiqni progresin dhe identifikoni pikat e dobëta",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">IAP-M Fakulteti i Biznesit</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Asistenti juaj{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Akademik me AI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transformoni përvojën tuaj të studimit me mjete inteligjente të dizajnuara për studentët e biznesit.
              Pyetni materialet, gjeneroni përmbledhje dhe përgatituni për provime me AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* @ts-ignore */}
              <Button variant="ai" size="xl" asChild>
                <Link to="/ai">
                  <Sparkles className="w-5 h-5" />
                  Hap Qendrën AI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              {/* @ts-ignore */}
              <Button variant="outline" size="xl" asChild>
                <Link to="/ai/help">
                  <BookOpen className="w-5 h-5" />
                  Mëso më shumë
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Gjithçka që ju duhet për sukses
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mjete të fuqishme AI të dizajnuara posaçërisht për sukses akademik në IAP-M
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="ai-card border border-border p-6 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <feature.icon className="w-6 h-6 text-secondary group-hover:text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-secondary to-secondary/90 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-secondary-foreground mb-6">
                  Studioni më zgjuar, jo më shumë
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-secondary-foreground/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-secondary-foreground/10 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold text-primary mb-2">87%</div>
                <p className="text-secondary-foreground/80">
                  e studentëve raportojnë përmirësim në performancën e provimeve duke përdorur mjete studimi me AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <GraduationCap className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Gati të transformoni studimet tuaja?
          </h2>
          <p className="text-muted-foreground mb-8">
            Bashkohuni me studentët e tjerë të IAP-M dhe përdorni AI për të arritur sukses akademik.
          </p>
          {/* @ts-ignore */}
          <Button variant="ai" size="xl" asChild>
            <Link to="/ai">
              <Sparkles className="w-5 h-5" />
              Fillo tani
            </Link>
          </Button>
        </div>
      </div>

      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-secondary-foreground">IAP-M AI</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm">
              © {new Date().getFullYear()} IAP-M Fakulteti i Biznesit. Të gjitha të drejtat e rezervuara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
