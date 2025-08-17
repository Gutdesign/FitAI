import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useHealthStore } from '../store/useHealthStore';
import { Play, Pause, Square, Clock, Zap, Dumbbell, Users, CheckCircle } from 'lucide-react';
import { Workout, WorkoutSession } from '../store/useHealthStore';

interface WorkoutCardProps {
  workout: Workout;
  className?: string;
}

export default function WorkoutCard({ workout, className }: WorkoutCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { addWorkoutSession, updateWorkoutSession } = useHealthStore();
  
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startWorkout = () => {
    setIsActive(true);
    setIsPaused(false);
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    setTimer(interval);
  };

  const pauseWorkout = () => {
    setIsPaused(true);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const resumeWorkout = () => {
    setIsPaused(false);
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    setTimer(interval);
  };

  const stopWorkout = (completed: boolean = false) => {
    setIsActive(false);
    setIsPaused(false);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    if (completed || timeElapsed > 60) { // Save if completed or worked out for more than 1 minute
      const session: WorkoutSession = {
        id: Date.now().toString(),
        workoutId: workout.id,
        date: new Date().toISOString(),
        duration: Math.floor(timeElapsed / 60), // Convert to minutes
        completed: completed,
        rating: completed ? undefined : 3 // Default rating, can be updated later
      };
      
      addWorkoutSession(session);
    }

    // Reset state
    setTimeElapsed(0);
    setCurrentStep(0);
  };

  const completeWorkout = () => {
    stopWorkout(true);
  };

  const nextStep = () => {
    if (currentStep < workout.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'hard': return 'bg-red-500/20 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio': return Zap;
      case 'strength': return Dumbbell;
      case 'flexibility': return Users;
      default: return Clock;
    }
  };

  const TypeIcon = getTypeIcon(workout.type);
  const progress = (timeElapsed / (workout.duration * 60)) * 100;

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">{workout.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {workout.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <TypeIcon className="h-3 w-3" />
                {workout.type}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {workout.duration}min
              </Badge>
              
              <Badge className={getDifficultyColor(workout.difficulty)}>
                {workout.difficulty}
              </Badge>

              {workout.equipment.length > 0 && (
                <Badge variant="outline" className="hidden sm:inline-flex">
                  {workout.equipment.join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Active Workout Interface */}
        {isActive && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-semibold">
                  {formatTime(timeElapsed)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {workout.duration}min
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {workout.instructions.length}
                </span>
              </div>
            </div>

            <Progress value={Math.min(progress, 100)} className="h-2" />

            {/* Current Instruction */}
            <div className="p-3 bg-card rounded-md">
              <p className="text-sm font-medium mb-2">Current Exercise:</p>
              <p className="text-sm">{workout.instructions[currentStep]}</p>
            </div>

            {/* Step Navigation */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={currentStep === workout.instructions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Instructions (when not active) */}
        {!isActive && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Instructions:</p>
            <div className="space-y-1">
              {workout.instructions.slice(0, 3).map((instruction, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {index + 1}. {instruction}
                </p>
              ))}
              {workout.instructions.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  ... and {workout.instructions.length - 3} more steps
                </p>
              )}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          {!isActive ? (
            <Button onClick={startWorkout} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="outline" onClick={pauseWorkout}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" onClick={resumeWorkout}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              
              <Button variant="outline" onClick={() => stopWorkout(false)}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              <Button onClick={completeWorkout} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}