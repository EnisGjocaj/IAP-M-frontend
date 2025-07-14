import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "react-toastify"
import { updateEnrollmentStatus } from "../../../api/training"

interface Training {
  id: number;
  enrollmentId: number;
  title: string;
  category: string;
  level: string;
  instructor: string;
  totalHours: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  attendance: number;
  grade: number | string;
  enrollmentDate: string;
  completionDate: string;
  certificateUrl: string | null;
  feedback: string;
  remainingHours: number;
}

interface TrainingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: Training;  
  studentProfileId: number;
  onReviewSubmitted: () => void;
  existingReview?: {
    rating: number;
    feedback: string;
  };
}

export function TrainingReviewModal({
  isOpen,
  onClose,
  training,
  studentProfileId,
  onReviewSubmitted,
  existingReview
}: TrainingReviewModalProps) {
  console.log('Training object received:', training);

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [feedback, setFeedback] = useState(existingReview?.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log('Full training object:', training);
      console.log('Training ID:', training.id);
      console.log('Student Profile ID:', studentProfileId);

      setIsSubmitting(true);
      
      if (!training.id || !studentProfileId) {
        console.error('Missing required IDs:', { 
          trainingId: training.id,
          studentProfileId: studentProfileId
        });
        throw new Error('Missing required IDs');
      }

      const response = await updateEnrollmentStatus(
        training.id.toString(), 
        studentProfileId.toString(),
        {
          feedback,
          rating,
          grade: rating * 20,
          status: 'COMPLETED',
          completionDate: new Date()
        }
      );

      console.log('Response from server:', response);
      
      if (
        response.data?.statusCode === 200 || 
        response.statusCode === 200 || 
        (response.id && response.feedback)
      ) {
        toast.success("Review saved successfully");
        onReviewSubmitted();
        onClose();
      } else {
        console.error('Unexpected response structure:', response);
        toast.error("Failed to save review");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      console.error("Error details:", {
        training,
        studentProfileId,
        rating,
        feedback
      });
      toast.error(
        !studentProfileId 
          ? "Student profile ID is missing" 
          : "Failed to save review: " + (error.message || 'Unknown error')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? 'Edit Review' : 'Add Review'}
          </DialogTitle>
          <DialogDescription>
            Share your experience about {training?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rating >= value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRating(value)}
                  className="p-2"
                >
                  <Star
                    className={`w-4 h-4 ${
                      rating >= value
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about this training..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !rating || !feedback.trim()}
          >
            {isSubmitting ? "Saving..." : "Save Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
