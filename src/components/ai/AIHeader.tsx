import React from "react";
import { useLocation, Link } from "react-router-dom";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Search, 
  Bell, 
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

const pageConfig: Record<string, { title: string; description: string }> = {
  "/ai": { title: "Paneli", description: "Përmbledhje e aktivitetit tuaj akademik" },
  "/ai/materials": { title: "Materialet", description: "Ngarkoni dhe menaxhoni materialet e studimit" },
  "/ai/ask": { title: "Pyet AI", description: "Bëni pyetje mbi materialet tuaja akademike" },
  "/ai/summarize": { title: "Përmbledhje", description: "Gjeneroni përmbledhje të shkurtra" },
  "/ai/exam": { title: "Motori i Provimeve", description: "Praktikoni dhe përgatituni për provime" },
  "/ai/advisor": { title: "Këshilltari", description: "Rekomandime të personalizuara për studim" },
  "/ai/help": { title: "Ndihmë", description: "Mbështetje dhe udhëzime" },
  "/ai/settings": { title: "Cilësimet", description: "Konfiguroni preferencat tuaja" },
};

export const AIHeader: React.FC = () => {
  const location = useLocation();
  const currentPage = pageConfig[location.pathname] || pageConfig["/ai"];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        <div className="flex-1">
          <h1 className="text-sm font-medium text-foreground">
            {currentPage.title}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {currentPage.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Kërko..."
              className="w-48 pl-8 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-secondary text-[10px] text-secondary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-xs">Njoftime</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">U ngarkua material i ri</span>
                <span className="text-xs text-muted-foreground">Moduli 5 i Financave tani është i disponueshëm</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">Kujtesë për provim</span>
                <span className="text-xs text-muted-foreground">Provimi i Marketingut pas 3 ditësh</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">Rekomandim studimi</span>
                <span className="text-xs text-muted-foreground">Rishikoni Statistikë – Kapitulli 4</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">
                <div className="flex flex-col">
                  <span>Profili i Studentit</span>
                  <span className="font-normal text-muted-foreground">student@iapm.edu</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">Profili im</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Historiku i Studimit</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Raporti i Progresit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm" asChild>
                <Link to="/">Kthehu te Faqja Kryesore</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-destructive">Dil</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AIHeader;
