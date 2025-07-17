"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { getTraining, getTrainingEnrollments, updateEnrollmentStatus } from "../../../api/training"
import { Button } from "../../../components/ui/button"
import { Plus, UserPlus, CheckCircle, Trophy, MoreHorizontal } from "lucide-react"
import { toast } from "react-toastify"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { AddStudentsModal } from './add-students-modal'
import { ManageStudentModal } from "./ManageStudentModal"
import { createFeaturedStudent, createFeaturedStudentFormData } from "../../../api/featuredStudents";
import { FaStar } from 'react-icons/fa';

interface TrainingDetailsModalProps {
  trainingId: string | null
  isOpen: boolean
  onClose: () => void
}

export function TrainingDetailsModal({ trainingId, isOpen, onClose }: TrainingDetailsModalProps) {
  const [training, setTraining] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [allowSpecialEnrollment, setAllowSpecialEnrollment] = useState(false);

  useEffect(() => {
    if (trainingId && isOpen) {
      fetchTrainingDetails()
    }
  }, [trainingId, isOpen, showAddStudentModal])

  const fetchTrainingDetails = async () => {
    try {
      setLoading(true)
      console.log('Fetching details for training ID:', trainingId);
      
      const [trainingRes, enrollmentsRes] = await Promise.all([
        getTraining(trainingId!),
        getTrainingEnrollments(trainingId!)
      ]);

      console.log('Raw training response:', trainingRes);
      console.log('Raw enrollments response:', enrollmentsRes);
      
      if (trainingRes?.message) {
        console.log('Setting training from message:', trainingRes.message);
        setTraining(trainingRes.message);
      } else if (trainingRes) {
        console.log('Setting training directly:', trainingRes);
        setTraining(trainingRes);
      }

    
      if (Array.isArray(enrollmentsRes)) {
        console.log('Setting enrollments directly:', enrollmentsRes);
        setEnrollments(enrollmentsRes);
      } else if (enrollmentsRes?.message && Array.isArray(enrollmentsRes.message)) {
        console.log('Setting enrollments from message:', enrollmentsRes.message);
        setEnrollments(enrollmentsRes.message);
      } else {
        console.log('No valid enrollments found');
        setEnrollments([]);
      }
    } catch (error) {
      console.error('Error fetching training details:', error);
      setTraining(null);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getTrainingStatus = (training: any) => {
    const now = new Date();
    const startDate = new Date(training.startDate);
    const endDate = new Date(training.endDate);

    if (!training.isActive) return "INACTIVE";
    if (now < startDate) return "UPCOMING";
    if (now > endDate) return "COMPLETED";
    return "IN_PROGRESS";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background px-6 pt-8 pb-6">
              <DialogTitle className="sr-only">Training Details</DialogTitle>
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {training?.title || 'Untitled Training'}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        {training?.category?.replace('_', ' ') || 'N/A'}
                      </Badge>
                      <span>•</span>
                      <span>{training?.level || 'N/A'}</span>
                      <span>•</span>
                      <span>{training?.totalHours || 0} hours</span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      training?.isActive 
                        ? "bg-green-50 text-green-700 border-green-200 px-3 py-1" 
                        : "bg-gray-50 text-gray-700 border-gray-200 px-3 py-1"
                    }`}
                  >
                    {training?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-3xl">
                  {training?.description || 'No description available'}
                </p>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <div className="border-b">
                <TabsList className="h-12 px-6 w-full justify-start gap-4">
                  <TabsTrigger value="details" className="data-[state=active]:bg-background">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="students" className="data-[state=active]:bg-background">
                    Students ({enrollments.length})
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="data-[state=active]:bg-background">
                    Statistics
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[calc(85vh-280px)] px-6 py-6">
                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-md">
                      <CardHeader className="bg-muted/50 rounded-t-lg">
                        <CardTitle className="text-lg">Training Information</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Category</label>
                              <p className="mt-1 font-medium">{training?.category?.replace('_', ' ') || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Level</label>
                              <p className="mt-1 font-medium">{training?.level || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Instructor</label>
                            <div className="mt-1 flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{training?.instructor?.[0] || '?'}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{training?.instructor || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                      <CardHeader className="bg-muted/50 rounded-t-lg">
                        <CardTitle className="text-lg">Schedule & Capacity</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Duration</label>
                            <p className="mt-1 font-medium">{training?.totalHours || 0} hours</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Period</label>
                            <div className="mt-1 flex items-center gap-2 font-medium">
                              <span>{training?.startDate ? new Date(training.startDate).toLocaleDateString() : 'N/A'}</span>
                              <span>→</span>
                              <span>{training?.endDate ? new Date(training.endDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                            <p className="mt-1 font-medium">
                              {training?.maxParticipants 
                                ? `${enrollments.length}/${training.maxParticipants} participants`
                                : 'Unlimited participants'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="mt-0">
                  <Card className="border-none shadow-md">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Enrolled Students</CardTitle>
                          <CardDescription>
                            {enrollments.length} student{enrollments.length !== 1 ? 's' : ''} enrolled in this training
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrainingStatus(training) === "COMPLETED" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAllowSpecialEnrollment(!allowSpecialEnrollment)}
                              className={`${
                                allowSpecialEnrollment 
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100" 
                                  : ""
                              }`}
                            >
                              {allowSpecialEnrollment ? "Disable" : "Enable"} Special Enrollment
                            </Button>
                          )}
                          <Button 
                            size="default"
                            onClick={() => setShowAddStudentModal(true)}
                            className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-[1px]"
                            disabled={getTrainingStatus(training) === "COMPLETED" && !allowSpecialEnrollment}
                          >
                            <UserPlus className="h-4 w-4 stroke-[2]" />
                            Enroll Students
                          </Button>
                        </div>
                      </div>
                      {getTrainingStatus(training) === "COMPLETED" && allowSpecialEnrollment && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                          ⚠️ Special enrollment is enabled. You can now add students to this completed training.
                        </div>
                      )}
                      {getTrainingStatus(training) === "COMPLETED" && !allowSpecialEnrollment && (
                        <div className="text-sm text-muted-foreground mt-2">
                          This training has been completed. Enable special enrollment to add more students.
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {enrollments.length === 0 ? (
                          <div className="text-center py-12 bg-muted/5 rounded-lg border border-dashed flex flex-col items-center">
                            <div className="bg-primary/10 p-3 rounded-full mb-3">
                              <UserPlus className="h-8 w-8 text-primary" />
                            </div>
                            <p className="font-medium text-muted-foreground">No students enrolled yet</p>
                            <p className="text-sm text-muted-foreground/75 mt-1 max-w-sm">
                              Click the Enroll Students button to add students to this training
                            </p>
                            <Button
                              onClick={() => setShowAddStudentModal(true)}
                              variant="outline"
                              className="mt-4 border-primary/20 hover:bg-primary/5"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Enroll Your First Student
                            </Button>
                          </div>
                        ) : (
                          enrollments.map((enrollment) => (
                            <div 
                              key={enrollment.id} 
                              className="flex items-center justify-between p-4 rounded-lg border bg-muted/5 hover:bg-muted/10 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src={enrollment.profile?.profileImage} />
                                  <AvatarFallback>
                                    {enrollment.profile?.user?.name?.[0] || '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {enrollment.profile?.user?.name || 'Unknown Student'}
                                  </p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <p className="text-sm text-muted-foreground">
                                      Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Progress: {enrollment.progress}%
                                    </p>
                                    {enrollment.attendance > 0 && (
                                      <p className="text-sm text-muted-foreground">
                                        Attendance: {enrollment.attendance}%
                                      </p>
                                    )}
                                    {enrollment.grade && (
                                      <p className="text-sm text-muted-foreground">
                                        Grade: {enrollment.grade}
                                      </p>
                                    )}
                                    
                                    {enrollment.trainingReviews && enrollment.trainingReviews.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, index) => {
                                            const rating = enrollment.trainingReviews[0]?.rating || 0;
                                            return (
                                              <FaStar
                                                key={index}
                                                size={14}
                                                className={
                                                  index < rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                }
                                              />
                                            );
                                          })}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                          ({enrollment.trainingReviews[0]?.rating || 0}/5)
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {enrollment.profile?.university && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {enrollment.profile.university} • {enrollment.profile.faculty}
                                    </p>
                                  )}
                                  {/* Add Review Content if exists */}
                                  {enrollment.trainingReviews && enrollment.trainingReviews.length > 0 && enrollment.trainingReviews[0]?.content && (
                                    <div className="mt-2 text-sm text-muted-foreground italic">
                                      "{enrollment.trainingReviews[0].content}"
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={
                                    enrollment.status === 'COMPLETED' ? 'outline' :
                                    enrollment.status === 'IN_PROGRESS' ? 'default' :
                                    enrollment.status === 'DROPPED' ? 'destructive' : 
                                    'secondary'
                                  }
                                >
                                  {enrollment.status}
                                </Badge>
                                {(getTrainingStatus(training) !== "COMPLETED" || allowSpecialEnrollment) && (
                                  <StudentStatusActions 
                                    enrollment={enrollment} 
                                    onUpdate={fetchTrainingDetails}
                                    allowSpecialEnrollment={allowSpecialEnrollment}
                                    training={training} 
                                  />
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="statistics" className="mt-0">
                  <Card className="border-none shadow-md">
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="text-lg">Training Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 rounded-lg bg-muted/5 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <p className="text-3xl font-bold">
                            {enrollments.length ? 
                              `${Math.round((enrollments.filter(e => e?.status === 'COMPLETED').length / enrollments.length) * 100)}%` 
                              : '0%'}
                          </p>
                        </div>
                        <div className="p-6 rounded-lg bg-muted/5 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                          <p className="text-3xl font-bold">
                            {enrollments.length ? 
                              `${Math.round(enrollments.reduce((acc, e) => acc + (e?.progress || 0), 0) / enrollments.length)}%`
                              : '0%'}
                          </p>
                        </div>
                        <div className="p-6 rounded-lg bg-muted/5 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                          <p className="text-3xl font-bold">
                            {enrollments.filter(e => e?.status === 'IN_PROGRESS').length}
                          </p>
                        </div>
                        <div className="p-6 rounded-lg bg-muted/5 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Completed Students</p>
                          <p className="text-3xl font-bold">
                            {enrollments.filter(e => e?.status === 'COMPLETED').length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
            <AddStudentsModal
              trainingId={trainingId!}
              isOpen={showAddStudentModal}
              onClose={() => setShowAddStudentModal(false)}
              onStudentsAdded={fetchTrainingDetails}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 

function StudentStatusActions({ 
  enrollment, 
  onUpdate,
  allowSpecialEnrollment,
  training
}: { 
  enrollment: any, 
  onUpdate: () => void,
  allowSpecialEnrollment?: boolean,
  training: any
}) {
  const [updating, setUpdating] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)

  console.log('Enrollment status:', enrollment.status);
  console.log('Enrollment grade:', enrollment.grade);
  console.log('Training:', training);

  const canPromote = enrollment.status === 'COMPLETED' && enrollment.grade >= 7.0;
  console.log('Can promote:', canPromote);

  const handleStatusUpdate = async (data: any) => {
    try {
      setUpdating(true)
      await updateEnrollmentStatus(
        enrollment.trainingId.toString(),
        enrollment.profileId.toString(),
        data
      )
      toast.success('Student status updated')
      onUpdate()
    } catch (error) {
      toast.error('Failed to update status')
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const handlePromoteToFeatured = async () => {
    try {
      setUpdating(true);
      const studentProfile = enrollment.profile;
      const user = studentProfile.user;

      const studentData = {
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: studentProfile.phoneNumber || "",
        courseType: training.category as 'INFORMATION_SCIENCE' | 'AGROBUSINESS' | 'ACCOUNTING' | 'MARKETING', // Use training.category instead of enrollment.training.category
        score: enrollment.grade || 0,
        description: studentProfile.bio || "No bio available",
        achievements: [], 
        graduationDate: enrollment.completionDate || new Date(),
        linkedinUrl: studentProfile.linkedinUrl || "",
        testimonial: enrollment.feedback || "",
        isActive: true
      };

      const formData = createFeaturedStudentFormData(studentData);

      if (studentProfile.profileImage) {
        try {
          const response = await fetch(studentProfile.profileImage);
          const blob = await response.blob();
          const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });
          formData.append('image', file);
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }

      await createFeaturedStudent(formData);
      toast.success('Student promoted to featured student');
    } catch (error) {
      console.error('Error promoting student:', error);
      toast.error('Failed to promote student');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={updating}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Manage Student</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowManageModal(true)}>
            Update Progress
          </DropdownMenuItem>
          
          {enrollment.status === 'COMPLETED' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handlePromoteToFeatured}
                className="text-primary flex items-center"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Promote to Featured Student
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          {enrollment.status !== 'DROPPED' && (
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleStatusUpdate({ status: 'DROPPED' })}
            >
              Mark as Dropped
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ManageStudentModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        enrollment={enrollment}
        onUpdate={handleStatusUpdate}
      />
    </>
  );
} 
