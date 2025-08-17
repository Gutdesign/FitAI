import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useHealthStore } from '../store/useHealthStore';
import { Clock, Zap, Users, Dumbbell, Play } from 'lucide-react';

const quickWorkouts = [
  {
    id: 'desk-stretch',
    name: 'Desk Stretch Break',
    duration: 3,
    type: 'flexibility',
    icon: Users,
    description: 'Quick relief for neck, shoulders, and back',
    exercises: [
      '30s Neck circles',
      '30s Shoulder rolls', 
      '30s Seated spinal twist',
      '30s Wrist stretches',
      '30s Eye movement exercises',
      '30s Deep breathing'
    ]
  },
  {
    id: 'energy-boost',
    name: 'Energy Booster',
    duration: 5,
    type: 'cardio',
    icon: Zap,
    description: 'Get your blood flowing with quick cardio',
    exercises: [
      '1min Marching in place',
      '30s Arm circles',
      '1min Modified jumping jacks',
      '30s Desk push-ups',
      '1min High knees',
      '1min Cool down stretches'
    ]
  },
  {
    id: 'posture-fix',
    name: 'Posture Reset',
    duration: 4,
    type: 'strength',
    icon: Dumbbell,
    description: 'Counteract the effects of sitting all day',
    exercises: [
      '45s Wall angels',
      '45s Cat-cow stretches',
      '45s Doorway chest stretch',
      '45s Hip flexor stretches',
      '30s Glute bridges',
      '30s Plank hold'
    ]
  }
];

interface QuickWorkoutsProps {
  onStartWorkout?: (workoutId: string) => void;
}

export default function QuickWorkouts({ onStartWorkout }: QuickWorkoutsProps) {
  const { addWorkoutSession } = useHealthStore();

  const startQuickWorkout = (workout: typeof quickWorkouts[0]) => {
    // Create a workout session
    const session = {
      id: Date.now().toString(),
      workoutId: workout.id,
      date: new Date().toISOString(),
      duration: workout.duration,
      completed: false
    };

    addWorkoutSession(session);
    
    if (onStartWorkout) {
      onStartWorkout(workout.id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio': return 'text-red-500 bg-red-500/10';
      case 'strength': return 'text-blue-500 bg-blue-500/10';
      case 'flexibility': return 'text-green-500 bg-green-500/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick Workouts</h3>
        <Badge variant="outline" className="text-xs">
          Perfect for busy schedules
        </Badge>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {quickWorkouts.map((workout) => {
          const Icon = workout.icon;
          
          return (
            <Card key={workout.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(workout.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {workout.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {workout.duration}min
                    </div>
                  </div>
                  
                  {/* Exercise preview */}
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Exercises:</div>
                    <div className="flex flex-wrap gap-1">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <span key={index} className="text-xs bg-muted/50 px-2 py-1 rounded">
                          {exercise.split(' ').slice(1).join(' ')}
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{workout.exercises.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => startQuickWorkout(workout)}
                    className="w-full sm:w-auto"
                  >
                    <Play className="h-3 w-3 mr-2" />
                    Start Now
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA for longer workouts */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="text-center">
          <h4 className="font-medium mb-1">Ready for More?</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Explore full workout plans tailored for IT professionals
          </p>
          <Button variant="outline" size="sm">
            View All Workouts
          </Button>
        </div>
      </Card>
    </div>
  );
}