import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export const SettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  const [studyTips, setStudyTips] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Cilësimet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Menaxhoni llogarinë dhe preferencat tuaja
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profili</TabsTrigger>
          <TabsTrigger value="notifications">Njoftime</TabsTrigger>
          <TabsTrigger value="appearance">Pamja</TabsTrigger>
          <TabsTrigger value="privacy">Privatësia</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Të dhëna personale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Emri</Label>
                  <Input id="firstName" placeholder="John" defaultValue="Student" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Mbiemri</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" defaultValue="student@iapm.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">ID e studentit</Label>
                  <Input id="studentId" placeholder="STU-12345" defaultValue="STU-2024-001" />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program">Programi</Label>
                  <Select defaultValue="mba">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mba">MBA</SelectItem>
                      <SelectItem value="bba">BBA</SelectItem>
                      <SelectItem value="msba">MS Business Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Viti</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Viti 1</SelectItem>
                      <SelectItem value="2">Viti 2</SelectItem>
                      <SelectItem value="3">Viti 3</SelectItem>
                      <SelectItem value="4">Viti 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Ruaj ndryshimet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Njoftime me email</p>
                  <p className="text-sm text-muted-foreground">Merrni përditësime me email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Kujtesa për provime</p>
                  <p className="text-sm text-muted-foreground">Njoftime për provimet e ardhshme</p>
                </div>
                <Switch checked={examReminders} onCheckedChange={setExamReminders} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Këshilla studimi</p>
                  <p className="text-sm text-muted-foreground">Merrni rekomandime të personalizuara</p>
                </div>
                <Switch checked={studyTips} onCheckedChange={setStudyTips} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="font-medium text-sm text-foreground">Modaliteti i errët</p>
                    <p className="text-sm text-muted-foreground">Kaloni midis temës së çelët dhe të errët</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Gjuha</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Ndani analitika</p>
                  <p className="text-sm text-muted-foreground">Ndihmoni të përmirësohet AI me të dhëna të anonimizuara</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">Profil publik</p>
                  <p className="text-sm text-muted-foreground">Bëni arritjet të dukshme për të tjerët</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                  Fshi të dhënat e llogarisë
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
