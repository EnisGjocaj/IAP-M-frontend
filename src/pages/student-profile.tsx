"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import { getStudentProfile, updateStudentProfile, addSkill, addBadge, addTraining, addAcademicSubject } from "../api/studentProfile"
import { toast } from "react-toastify"
import {
  Download,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
  User,
  BookOpen,
  Award,
  Clock,
  Target,
  TrendingUp,
  Settings,
  Github,
  Linkedin,
  Globe,
  CalendarIcon,
  Users,
  MessageSquare,
  BarChart3,
  X,
  Loader2,
  AlertCircle,
  Facebook,
  FileText,
  Eye,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge as BadgeComponent } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Separator } from "../components/ui/separator"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { PDFDownloadLink, PDFDownloadLinkProps } from '@react-pdf/renderer';
import type { BlobProviderParams } from '@react-pdf/renderer';
import CVTemplate from '../components/CVTemplate';
import { TrainingReviewModal } from "../components/improved-dashboard/featured-students/TrainingReviewModal"

const calculateRating = (grade: number | null | undefined): number => {
  if (!grade && grade !== 0) return 0;
  return Math.min(5, Math.max(0, Math.floor(grade / 20)));
};

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { userId } = useParams()
  const { user } = useAuth()


  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canEdit = user?.id?.toString() === userId?.toString();
  console.log('Can edit check:', { 
    userId, 
    currentUserId: user?.id, 
    userIdType: typeof userId,
    currentUserIdType: typeof user?.id,
    canEdit 
  });

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    university: '',
    faculty: '',
    year: '',
    gpa: '',
    bio: '',
    location: '',
    phoneNumber: '',
    linkedinUrl: '',
    facebookUrl: '',
    cvPath: '',
    githubUrl: '',
    portfolioUrl: '',
    attendance: '',
    totalCredits: '',
  });

  useEffect(() => {
    if (studentData) {
      console.log('Updating form state with student data:', studentData);
      setFormState(prevState => ({
        ...prevState,
        name: studentData.name || '',
        email: studentData.email || '',
        university: studentData.university || '',
        faculty: studentData.faculty || '',
        year: studentData.year || '',
        gpa: studentData.academicData?.currentGPA?.toString() || '',
        bio: studentData.bio || '',
        location: studentData.location || '',
        phoneNumber: studentData.phone || '',
        linkedinUrl: studentData.socialLinks?.linkedin || '',
        facebookUrl: studentData.socialLinks?.facebook || '',
        cvPath: studentData.cvPath || '',
        githubUrl: studentData.socialLinks?.github || '',
        portfolioUrl: studentData.socialLinks?.portfolio || '',
        attendance: studentData.academicData?.attendance?.toString() || '',
        totalCredits: studentData.academicData?.totalCredits?.toString() || '',
      }));
    }
  }, [studentData]);

  useEffect(() => {
    console.log('isEditing state changed:', isEditing);
    console.log('canEdit value when editing changes:', canEdit);
  }, [isEditing]);

  useEffect(() => {
    console.log('formState changed:', formState);
  }, [formState]);

  useEffect(() => {
    console.log('studentData changed:', studentData);
  }, [studentData]);

  useEffect(() => {
    console.log('Can edit:', canEdit);
    console.log('User ID:', user?.id);
    console.log('Profile ID:', userId);
  }, [canEdit, user?.id, userId]);

  useEffect(() => {
    if (user && userId) {
      console.log('User authentication check:', {
        userId: userId,
        userIdType: typeof userId,
        currentUserId: user.id,
        currentUserIdType: typeof user.id,
        isMatch: user.id?.toString() === userId?.toString()
      });
    }
  }, [user, userId]);


  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      
      formData.append('profileImage', file);
      
      await handleProfileUpdate(formData);
      toast.success("Fotoja u ngarkua me sukses");
      await fetchStudentProfile();
    } catch (error) {
      toast.error("Gabim gjatë ngarkimit të fotos");
    }
  };

  const [cvUploadState, setCvUploadState] = useState({
    isLoading: false,
    error: null as string | null,
  });

  const handleCVUpload = async (file: File) => {
    try {
      setCvUploadState({ isLoading: true, error: null });

      if (file.size > 5 * 1024 * 1024) { 
        setCvUploadState({ 
          isLoading: false, 
          error: "CV file size must be less than 5MB" 
        });
        toast.error("CV file size must be less than 5MB");
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setCvUploadState({ 
          isLoading: false, 
          error: "Please upload a PDF or Word document" 
        });
        toast.error("Please upload a PDF or Word document");
        return;
      }

      const formData = new FormData();
      formData.append('cv', file);

      const response = await updateStudentProfile(userId || user?.id, formData);
      
      if (response.status === 200) {
        setCvUploadState({ isLoading: false, error: null });
        toast.success("CV uploaded successfully");
        setActiveTab("cv");
        await fetchStudentProfile();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setCvUploadState({ 
        isLoading: false, 
        error: "Error uploading CV. Please try again." 
      });
      toast.error("Error uploading CV. Please try again.");
    }
  };

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile for user ID:', userId || user?.id);
      
      const response = await getStudentProfile(userId || user?.id);
      console.log('Raw API Response:', response);
      const data = response.data;

      
      const mappedTrainings = {
        completed: [],
        ongoing: [],
        upcoming: []
      };

      const safeParseDate = (dateString: string | null | undefined): Date | null => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      };

      const getTrainingStatus = (training: any, enrollment: any): string => {
        if (!training) return "UNKNOWN";
        
        const now = new Date();
        const startDate = safeParseDate(training.startDate);
        const endDate = safeParseDate(training.endDate);

        if (!startDate || !endDate) return "UNKNOWN";
        
        if (!training.isActive) return "INACTIVE";
        if (now < startDate) return "UPCOMING";
        if (now > endDate) return "COMPLETED";
        return "IN_PROGRESS";
      };

      if (data.trainings && Array.isArray(data.trainings)) {
        console.log('Processing trainings:', data.trainings.length, 'found');
        
        data.trainings.forEach(enrollment => {
          console.log('Processing enrollment:', enrollment);
          
          const training = enrollment.training;
          
          const calculatedStatus = getTrainingStatus(training, enrollment);

          const mappedTraining = {
            id: enrollment.trainingId,
            enrollmentId: enrollment.id,
            title: training?.title || 'Untitled Training',
            category: training?.category || 'N/A',
            level: training?.level || 'N/A',
            instructor: training?.instructor || 'N/A',
            totalHours: training?.totalHours || 0,
            startDate: training?.startDate ? new Date(training.startDate).toLocaleDateString() : 'N/A',
            endDate: training?.endDate ? new Date(training.endDate).toLocaleDateString() : 'N/A',
            status: calculatedStatus,
            progress: enrollment.progress || 0,
            attendance: enrollment.attendance || 0,
            grade: enrollment.grade || 'N/A',
            rating: calculateRating(enrollment.grade), 
            enrollmentDate: enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : 'N/A',
            completionDate: enrollment.completionDate ? new Date(enrollment.completionDate).toLocaleDateString() : 'N/A',
            certificateUrl: enrollment.certificateUrl || null,
            feedback: enrollment.feedback || '',
            remainingHours: training?.totalHours 
              ? Math.max(0, training.totalHours - (training.totalHours * (enrollment.progress / 100)))
              : 0,
            profileId: data.id 
          };

          switch (calculatedStatus) {
            case "COMPLETED":
              mappedTrainings.completed.push(mappedTraining);
              break;
            case "IN_PROGRESS":
              mappedTrainings.ongoing.push(mappedTraining);
              break;
            case "UPCOMING":
              mappedTrainings.upcoming.push(mappedTraining);
              break;
            default:
              console.warn('Training with unknown status:', mappedTraining);
              break;
          }
        });
      }

      console.log('Final mapped trainings:', mappedTrainings);

      const finalStudentData = {
        id: data.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.phoneNumber || "Not provided",
        university: data.university || "Not specified",
        faculty: data.faculty || "Not specified",
        year: data.year || "Not specified",
        gpa: data.gpa || 0,
        profileImage: data.profileImage || null,
        bio: data.bio || "No bio available",
        location: data.location || "Not specified",
        socialLinks: {
          linkedin: data.linkedinUrl || "",
          facebook: data.facebookUrl || "",
          github: data.githubUrl || "",
          portfolio: data.portfolioUrl || "",
          cvPath: data.cvPath || "",
        },
        academicData: {
          currentGPA: data.gpa || 0,
          totalCredits: data.totalCredits || 0,
          attendance: data.attendance || 0,
          subjects: data.academicSubjects || [],
        },
        trainingData: {
          completed: (mappedTrainings.completed || []).map(training => ({
            ...training,
            profileId: data.id 
          })),
          ongoing: mappedTrainings.ongoing || [],
          upcoming: mappedTrainings.upcoming || [],
        },
        skillsAndBadges: {
          skills: data.skills || [],
          badges: data.badges || [],
        },
      };

      console.log('Final student data being set:', finalStudentData);
      setStudentData(finalStudentData);

      setFormState(prevState => ({
        ...prevState,
        name: data.user.name || '',
        email: data.user.email || '',
        university: data.university || '',
        faculty: data.faculty || '',
        year: data.year || '',
        gpa: data.gpa?.toString() || '',
        bio: data.bio || '',
        location: data.location || '',
        phoneNumber: data.phoneNumber || '',
        linkedinUrl: data.linkedinUrl || '',
        facebookUrl: data.facebookUrl || '',
        githubUrl: data.githubUrl || '',
        portfolioUrl: data.portfolioUrl || '',
        cvPath: data.cvPath || '',
        attendance: data.attendance?.toString() || '',
        totalCredits: data.totalCredits?.toString() || '',
      }));

    } catch (err) {
      console.error('Error fetching profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load student profile");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile()
  }, [userId, user?.id])


const handleProfileUpdate = async (data: FormData | Object) => {
    try {
      let formData: FormData;
      
      if (!(data instanceof FormData)) {
        formData = new FormData();
        
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            
            formData.append(key, value.toString());
          }
        });
      } else {
        formData = data;
      }
  
      const response = await updateStudentProfile(userId || user?.id, formData);
      
      if (response.status === 200) {
        toast.success("Profili u përditësua me sukses");
        await fetchStudentProfile(); 
      } else {
        toast.error("Gabim gjatë përditësimit të profilit");
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error("Gabim gjatë përditësimit të profilit");
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
      await addSkill(userId || user?.id, skillData)
      toast.success("Skill added successfully")
      fetchStudentProfile()
    } catch (err) {
      toast.error("Failed to add skill")
    }
  }

  const handleAddBadge = async (badgeData) => {
    try {
      await addBadge(userId || user?.id, badgeData)
      toast.success("Badge added successfully")
      fetchStudentProfile()
    } catch (err) {
      toast.error("Failed to add badge")
    }
  }

  const handleAddTraining = async (trainingData) => {
    try {
      await addTraining(userId || user?.id, trainingData)
      toast.success("Training added successfully")
      fetchStudentProfile()
    } catch (err) {
      toast.error("Failed to add training")
    }
  }

  const handleAddSubject = async (subjectData) => {
    try {
      await addAcademicSubject(userId || user?.id, subjectData)
      toast.success("Subject added successfully")
      fetchStudentProfile()
    } catch (err) {
      toast.error("Failed to add subject")
    }
  }

  const validateUrl = (url: string): boolean => {
    if (!url) return true; 
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current form state:', formState);

    const urlsToValidate = [
      { name: 'LinkedIn', url: formState.linkedinUrl },
      { name: 'Facebook', url: formState.facebookUrl }
    ];

    for (const { name, url } of urlsToValidate) {
      if (url && !validateUrl(url)) {
        toast.error(`Invalid ${name} URL`);
        return;
      }
    }

    if (!validateEmail(formState.email)) {
      toast.error('Invalid email address');
      return;
    }

    try {
      if (!userId && !user?.id) {
        console.error('No user ID available');
        toast.error("User ID not found");
        return;
      }

      const cleanedData = {
        name: formState.name,
        email: formState.email,
        university: formState.university,
        faculty: formState.faculty,
        year: formState.year,
        gpa: parseFloat(formState.gpa) || undefined,
        bio: formState.bio,
        location: formState.location,
        phoneNumber: formState.phoneNumber,
        linkedinUrl: formState.linkedinUrl.trim(),
        facebookUrl: formState.facebookUrl.trim(),
        cvPath: formState.cvPath.trim(),
        githubUrl: formState.githubUrl.trim(),
        portfolioUrl: formState.portfolioUrl.trim(),
        attendance: parseFloat(formState.attendance) || undefined,
        totalCredits: parseInt(formState.totalCredits) || undefined,
      };

      console.log('Sending cleaned data to API:', cleanedData);
      
      const response = await updateStudentProfile(userId || user?.id, cleanedData);
      
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        await fetchStudentProfile(); 
        setIsEditing(false); 
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading profile: {error}</div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No profile data found</div>
      </div>
    )
  }

  const SocialLinkInput = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon 
  }: { 
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    icon: any;
  }) => (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  );

  const handleOpenReviewModal = (training) => {
    console.log('Opening review modal with training:', training);
    console.log('Current student data:', studentData);
    setSelectedTraining(training);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4 md:p-6 my-4 sm:my-10">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
              
              <div className="relative flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage 
                    src={studentData?.profileImage || "/placeholder.svg"} 
                    alt={studentData?.name || "Profile"} 
                  />
                  <AvatarFallback className="text-xl sm:text-2xl bg-white text-blue-600">
                    {studentData?.name
                      ? studentData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "S"}
                  </AvatarFallback>
                </Avatar>

                
                {canEdit && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 shadow-md"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />

                <div className="flex flex-row sm:flex-col gap-2 mt-3 w-full">
                  {canEdit && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 w-full"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Ndrysho
                    </Button>
                  )}
                  <Button 
                    className="text-xs sm:text-sm bg-white text-blue-600 hover:bg-gray-100 w-full"
                  >
                    <PDFDownloadLink
                      document={<CVTemplate studentData={studentData} />}
                      fileName={`${studentData.name.replace(/\s+/g, '_')}_CV.pdf`}
                      className="flex items-center justify-center w-full"
                    >
                      {(props: BlobProviderParams) => (
                        <div className="flex items-center justify-center">
                          {props.loading ? (
                            <>
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                              <span>Duke gjeneruar...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span>CV</span>
                            </>
                          )}
                        </div>
                      )}
                    </PDFDownloadLink>
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{studentData?.name || "Student"}</h1>
                  <p className="text-sm sm:text-base text-blue-100 mb-2 sm:mb-4">{studentData?.bio || "No bio available"}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">{studentData?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">{studentData?.phone}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">{studentData?.university}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">{studentData?.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {studentData?.socialLinks?.linkedin && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs sm:text-sm bg-white/90 text-blue-600 hover:bg-white"
                      onClick={() => window.open(studentData.socialLinks.linkedin, '_blank')}
                    >
                      <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      LinkedIn
                    </Button>
                  )}
                  {studentData?.socialLinks?.facebook && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs sm:text-sm bg-white/90 text-blue-600 hover:bg-white"
                      onClick={() => window.open(studentData.socialLinks.facebook, '_blank')}
                    >
                      <Facebook className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Facebook
                    </Button>
                  )}
                  {studentData?.email && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs sm:text-sm bg-white/90 text-blue-600 hover:bg-white"
                      onClick={() => window.location.href = `mailto:${studentData.email}`}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Email
                    </Button>
                  )}
                  {studentData?.cvPath && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs sm:text-sm bg-white/90 text-blue-600 hover:bg-white"
                      onClick={() => window.open(studentData.cvPath, '_blank')}
                    >
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      CV
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Mesatarja Aktuale</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{studentData.academicData.currentGPA}</p>
                </div>
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Trajnime të Përfunduara</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{studentData.trainingData.completed.length}</p>
                </div>
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Certifikata të Fituara</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">{studentData.skillsAndBadges.badges.length}</p>
                </div>
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Pjesëmarrja</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{studentData.academicData.attendance}%</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-white shadow-lg rounded-lg">
            <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Përmbledhje
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Akademike
            </TabsTrigger>
            <TabsTrigger value="training" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Trajnime
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Aftësitë
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Aktiviteti
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Vlerësimet
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex-shrink-0 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              CV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 border-0 shadow-lg bg-white rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Informacioni Personal</h3>
                    {canEdit && (
                      <Button 
                        onClick={() => {
                          console.log('Toggle edit mode');
                          setIsEditing(!isEditing);
                        }}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Anulo
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Ndrysho
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Emri</Label>
                        {isEditing ? (
                          <Input
                            name="name"
                            value={formState.name}
                            onChange={(e) => setFormState(prev => ({...prev, name: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.name}</p>
                        )}
                      </div>

                      <div>
                        <Label>Email</Label>
                        {isEditing ? (
                          <Input
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState(prev => ({...prev, email: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.email}</p>
                        )}
                      </div>

                      <div>
                        <Label>Universiteti</Label>
                        {isEditing ? (
                          <Input
                            name="university"
                            value={formState.university}
                            onChange={(e) => setFormState(prev => ({...prev, university: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.university}</p>
                        )}
                      </div>

                      <div>
                        <Label>Fakulteti</Label>
                        {isEditing ? (
                          <Input
                            name="faculty"
                            value={formState.faculty}
                            onChange={(e) => setFormState(prev => ({...prev, faculty: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.faculty}</p>
                        )}
                      </div>

                      <div>
                        <Label>Viti i Studimit</Label>
                        {isEditing ? (
                          <Input
                            name="year"
                            value={formState.year}
                            onChange={(e) => setFormState(prev => ({...prev, year: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.year}</p>
                        )}
                      </div>

                      <div>
                        <Label>Mesatarja Aktuale</Label>
                        {isEditing ? (
                          <Input
                            name="gpa"
                            type="number"
                            step="0.01"
                            value={formState.gpa}
                            onChange={(e) => setFormState(prev => ({...prev, gpa: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.academicData.currentGPA}</p>
                        )}
                      </div>

                      <div>
                        <Label>Numri i Telefonit</Label>
                        {isEditing ? (
                          <Input
                            name="phoneNumber"
                            value={formState.phoneNumber}
                            onChange={(e) => setFormState(prev => ({...prev, phoneNumber: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.phone}</p>
                        )}
                      </div>

                      <div>
                        <Label>Vendndodhja</Label>
                        {isEditing ? (
                          <Input
                            name="location"
                            value={formState.location}
                            onChange={(e) => setFormState(prev => ({...prev, location: e.target.value}))}
                          />
                        ) : (
                          <p className="mt-1 text-gray-600">{studentData.location}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Biografia</Label>
                      {isEditing ? (
                        <Input
                          name="bio"
                          value={formState.bio}
                          onChange={(e) => setFormState(prev => ({...prev, bio: e.target.value}))}
                        />
                      ) : (
                        <p className="mt-1 text-gray-600">{studentData.bio}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SocialLinkInput
                          label="LinkedIn URL"
                          value={formState.linkedinUrl}
                          onChange={(value) => setFormState(prev => ({...prev, linkedinUrl: value}))}
                          placeholder="https://linkedin.com/in/username"
                          icon={Linkedin}
                        />

                        <SocialLinkInput
                          label="Facebook URL"
                          value={formState.facebookUrl}
                          onChange={(value) => setFormState(prev => ({...prev, facebookUrl: value}))}
                          placeholder="https://facebook.com/username"
                          icon={Facebook}
                        />

                        <SocialLinkInput
                          label="Email"
                          value={formState.email}
                          onChange={(value) => setFormState(prev => ({...prev, email: value}))}
                          placeholder="your@email.com"
                          icon={Mail}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            if (studentData) {
                              setFormState({
                                name: studentData.name || '',
                                email: studentData.email || '',
                                university: studentData.university || '',
                                faculty: studentData.faculty || '',
                                year: studentData.year || '',
                                gpa: studentData.academicData?.currentGPA?.toString() || '',
                                bio: studentData.bio || '',
                                location: studentData.location || '',
                                phoneNumber: studentData.phone || '',
                                linkedinUrl: studentData.socialLinks?.linkedin || '',
                                facebookUrl: studentData.socialLinks?.facebook || '',
                                cvPath: studentData.cvPath || '',
                                githubUrl: studentData.socialLinks?.github || '',
                                portfolioUrl: studentData.socialLinks?.portfolio || '',
                                attendance: studentData.academicData?.attendance?.toString() || '',
                                totalCredits: studentData.academicData?.totalCredits?.toString() || '',
                              });
                            }
                          }}
                        >
                          Anulo
                        </Button>
                        <Button type="submit" className="bg-blue-600 text-white">
                          Ruaj ndryshimet
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Arritjet e Fundit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(studentData.skillsAndBadges.badges || []).slice(0, 3).map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                    >
                      <Award className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{badge.name}</p>
                        <p className="text-xs text-gray-600">{badge.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Performanca Akademike
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(studentData.academicData.subjects || []).map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{subject.name}</h4>
                          <p className="text-sm text-gray-600">
                            Semestri {subject.semester} • {subject.credits} Kredite
                          </p>
                        </div>
                        <BadgeComponent
                          variant={subject.grade.startsWith("A") ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {subject.grade}
                        </BadgeComponent>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Përmbledhje Akademike</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{studentData.academicData.currentGPA}</p>
                    <p className="text-sm text-gray-600">Mesatarja Aktuale</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{studentData.academicData.totalCredits}</p>
                    <p className="text-sm text-gray-600">Kredite Totale</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{studentData.academicData.attendance}%</p>
                    <p className="text-sm text-gray-600">Shkalla e Pjesëmarrjes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Trophy className="w-5 h-5" />
                    Trajnime të Përfunduara
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(studentData.trainingData.completed || []).map((training, index) => (
                    <div key={index} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{training.title}</h4>
                        <div className="flex items-center gap-2">
                          {/* grade percentage display */}
                          <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
                            <Star size={12} />
                            <span className="text-sm font-medium">{training.grade || 'N/A'}</span>
                          </div>
                          {training.certificateUrl && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs bg-transparent"
                              onClick={() => window.open(training.certificateUrl, '_blank')}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Certifikata
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        {/* grade progress bar */}
                        <div className="flex items-center justify-between">
                          <span>Nota:</span>
                          <span className="font-medium">{training.grade}%</span>
                        </div>
                        <Progress value={training.grade} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span>Pjesëmarrja:</span>
                          <span className="font-medium">{training.attendance}%</span>
                        </div>
                        <Progress value={training.attendance} className="h-2" />
                        <p>
                          Kategoria: {training.category} • Niveli: {training.level}
                        </p>
                        <p>Instruktori: {training.instructor}</p>
                        <p>
                          Përfunduar më: {new Date(training.completionDate).toLocaleDateString()} • {training.totalHours} orë
                        </p>
                        {training.feedback && (
                          <div className="mt-2 p-2 bg-white rounded border border-green-100">
                            <p className="font-medium text-xs mb-1">Feedback:</p>
                            <p className="text-xs">{training.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(studentData.trainingData.completed || []).length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      Nuk ka trajnime të përfunduara
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-5 h-5" />
                      Trajnime në Vazhdim
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(studentData.trainingData.ongoing || []).map((training, index) => (
                      <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">{training.title}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progresi:</span>
                            <span>{training.progress}%</span>
                          </div>
                          <Progress value={training.progress} className="h-2" />
                          <div className="flex items-center justify-between text-sm">
                            <span>Pjesëmarrja:</span>
                            <span>{training.attendance}%</span>
                          </div>
                          <Progress value={training.attendance} className="h-2" />
                          <p className="text-sm text-gray-600">
                            Instruktori: {training.instructor}
                          </p>
                          <p className="text-sm text-gray-600">
                            Orë të mbetura: {training.remainingHours} nga {training.totalHours}
                          </p>
                          <p className="text-sm text-gray-600">
                            Përfundon më: {new Date(training.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(studentData.trainingData.ongoing || []).length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        Nuk ka trajnime në vazhdim
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <CalendarIcon className="w-5 h-5" />
                      Trajnime të Ardhshme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(studentData.trainingData.upcoming || []).map((training, index) => (
                      <div key={index} className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                        <h4 className="font-medium mb-2">{training.title}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            Kategoria: {training.category} • Niveli: {training.level}
                          </p>
                          <p>Instruktori: {training.instructor}</p>
                          <p>Fillon më: {new Date(training.startDate).toLocaleDateString()}</p>
                          <p>Kohëzgjatja: {training.totalHours} orë</p>
                          <p>Maksimumi i pjesëmarrësve: {training.maxParticipants}</p>
                        </div>
                      </div>
                    ))}
                    {(studentData.trainingData.upcoming || []).length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        Nuk ka trajnime të ardhshme
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Progresi i Aftësive
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(studentData.skillsAndBadges.skills || []).map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifikata dhe Arritje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(studentData.skillsAndBadges.badges || []).map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                    >
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{badge.name}</h4>
                        <p className="text-sm text-gray-600">
                          {badge.type} • {badge.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Kronologjia e Aktivitetit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Aktivitet Shembull</h4>
                      <p className="text-sm text-gray-600 mb-1">Nuk ka të dhëna specifike për aktivitetin.</p>
                      <p className="text-xs text-gray-500">Përditësuar së fundmi: N/A</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Training Reviews and Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(studentData.trainingData.completed || []).map((training) => (
                  <div
                    key={training.id}
                    className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{training.title}</h4>
                            <span className="text-sm text-gray-600">• {training.category}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReviewModal(training)}
                          >
                            {training.feedback ? 'Edit Review' : 'Add Review'}
                          </Button>
                        </div>
                        {(training.rating || training.grade) && (
                          <>
                            <div className="flex gap-1 mb-2">
                              {Array.from({ length: calculateRating(training.grade) }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            {training.feedback && (
                              <p className="text-gray-700 italic">"{training.feedback}"</p>
                            )}
                          </>
                        )}
                        <div className="mt-2 text-sm text-gray-600">
                          Completed on: {new Date(training.completionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(studentData.trainingData.completed || []).length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-sm text-gray-500">
                      Complete trainings to start leaving reviews and testimonials.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedTraining && (
              <TrainingReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                  setIsReviewModalOpen(false)
                  setSelectedTraining(null)
                }}
                training={selectedTraining}
                studentProfileId={selectedTraining.profileId || studentData.id}
                onReviewSubmitted={fetchStudentProfile}
                existingReview={{
                  rating: selectedTraining.rating || 0,
                  feedback: selectedTraining.feedback || ''
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    CV Document
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCVUpload(file);
                        }}
                        className="hidden"
                        id="cv-upload"
                        disabled={cvUploadState.isLoading}
                      />
                      <Button 
                        onClick={() => document.getElementById('cv-upload')?.click()}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        disabled={cvUploadState.isLoading}
                      >
                        {cvUploadState.isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Upload New CV
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cvUploadState.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-sm text-gray-600">Uploading your CV...</p>
                  </div>
                ) : cvUploadState.error ? (
                  <div className="flex flex-col items-center justify-center py-12 text-red-600">
                    <AlertCircle className="w-8 h-8 mb-4" />
                    <p className="text-sm">{cvUploadState.error}</p>
                  </div>
                ) : studentData?.socialLinks?.cvPath ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        Current CV Document
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(studentData.socialLinks.cvPath, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                    
                    <div className="w-full h-[800px] border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={`${studentData.socialLinks.cvPath}#toolbar=0`}
                        className="w-full h-full"
                        title="CV Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No CV Uploaded</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload your CV to make it available for viewing and downloading.
                    </p>
                    {canEdit && (
                      <Button
                        onClick={() => document.getElementById('cv-upload')?.click()}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Upload CV
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
