import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

interface ManageStudentModalProps {
  isOpen: boolean
  onClose: () => void
  enrollment: any
  onUpdate: (data: any) => Promise<void>
}

export function ManageStudentModal({
  isOpen,
  onClose,
  enrollment,
  onUpdate
}: ManageStudentModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    attendance: enrollment.attendance || 0,
    progress: enrollment.progress || 0,
    grade: enrollment.grade || 0,
    feedback: enrollment.feedback || '',
  })

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await onUpdate({
        ...formData,
        status: 
          formData.progress >= 100 ? 'COMPLETED' :
          formData.progress > 0 ? 'IN_PROGRESS' :
          enrollment.status
      })
      onClose()
    } catch (error) {
      console.error('Error updating student:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Student Progress</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="progress" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({
                    ...formData,
                    progress: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <Label>Grade</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.grade}
                  onChange={(e) => setFormData({
                    ...formData,
                    grade: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4 mt-4">
            <div>
              <Label>Attendance (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) => setFormData({
                  ...formData,
                  attendance: Number(e.target.value)
                })}
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            <div>
              <Label>Feedback</Label>
              <Textarea
                value={formData.feedback}
                onChange={(e) => setFormData({
                  ...formData,
                  feedback: e.target.value
                })}
                placeholder="Provide feedback for the student..."
                className="min-h-[150px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}