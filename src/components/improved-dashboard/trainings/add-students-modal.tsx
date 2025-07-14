"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Checkbox } from "../../../components/ui/checkbox"
import { Search } from "lucide-react"
import { getAllStudents } from "../../../api/manageUsers"
import { enrollStudent } from "../../../api/training"
import { toast } from "react-toastify"
import { Badge } from "../../../components/ui/badge"

interface AddStudentsModalProps {
  trainingId: string
  isOpen: boolean
  onClose: () => void
  onStudentsAdded: () => void
}

export function AddStudentsModal({
  trainingId,
  isOpen,
  onClose,
  onStudentsAdded
}: AddStudentsModalProps) {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchStudents()
    }
  }, [isOpen])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllStudents()
      console.log('Raw response:', response)
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const transformedStudents = response.data.data.map((student: any) => ({
          id: student?.id?.toString() || 'N/A',
          name: student?.name || '',
          surname: student?.surname || '',
          email: student?.email || 'No email',
          studentProfile: student?.studentProfile ? {
            id: student.studentProfile.id?.toString(), 
            university: student.studentProfile.university || 'Not specified',
            faculty: student.studentProfile.faculty || 'Not specified',
            year: student.studentProfile.year || 'Not specified',
            gpa: student.studentProfile.gpa || null
          } : null
        }))
        console.log('Transformed students:', transformedStudents)
        setStudents(transformedStudents)
      } else {
        console.log('No students data found:', response)
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to fetch students')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleEnrollStudents = async () => {
    try {
      await Promise.all(
        selectedStudents.map(async (userId) => {
          const student = students.find(s => s.id.toString() === userId)
          if (!student) {
            throw new Error(`Student not found with ID ${userId}`)
          }

          const profileId = student.studentProfile?.id
          if (!profileId) {
            throw new Error(`No profile found for student ${student.name}. Please make sure they have a student profile.`)
          }

          console.log('Enrolling student:', {
            userId,
            profileId,
            trainingId,
            student
          })

          return enrollStudent(trainingId, profileId.toString())
        })
      )
      toast.success('Students enrolled successfully')
      onStudentsAdded()
      onClose()
    } catch (error) {
      console.error('Error enrolling students:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to enroll students')
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.university.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('Current students state:', students) 
  console.log('Filtered students:', filteredStudents) 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Students to Training</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading students...</div>
            ) : students.length === 0 ? ( 
              <div className="text-center py-4 text-muted-foreground">
                No students found
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id.toString())}
                    onCheckedChange={(checked) => {
                      setSelectedStudents(
                        checked
                          ? [...selectedStudents, student.id.toString()]
                          : selectedStudents.filter(id => id !== student.id.toString())
                      )
                    }}
                    disabled={!student.studentProfile?.id}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {student.name} {student.surname}
                      </p>
                      {student.studentProfile?.id ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {student.studentProfile.faculty}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          No Student Profile
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.email} • {student.studentProfile?.university || 'No University'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleEnrollStudents}
            disabled={selectedStudents.length === 0}
          >
            Add Selected Students ({selectedStudents.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 