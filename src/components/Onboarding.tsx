import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useHealthStore } from '../store/useHealthStore';
import { User2, Briefcase, Target, Dumbbell, Clock, Bell } from 'lucide-react';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(25).max(65),
  jobTitle: z.string().min(2, 'Job title is required'),
  workHours: z.number().min(6).max(16),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  equipment: z.array(z.string()),
  workoutTime: z.string(),
  duration: z.number().min(5).max(120),
  reminderTime: z.string()
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 1, title: 'Personal Info', icon: User2 },
  { id: 2, title: 'Work & Lifestyle', icon: Briefcase },
  { id: 3, title: 'Fitness Goals', icon: Target },
  { id: 4, title: 'Equipment', icon: Dumbbell },
  { id: 5, title: 'Preferences', icon: Clock }
];

const fitnessGoals = [
  'Weight Loss',
  'Muscle Building',
  'Stress Reduction',
  'Better Posture',
  'Increased Energy',
  'Better Sleep',
  'General Fitness',
  'Flexibility'
];

const availableEquipment = [
  'None (Bodyweight only)',
  'Resistance Bands',
  'Dumbbells',
  'Kettlebell',
  'Yoga Mat',
  'Pull-up Bar',
  'Foam Roller',
  'Exercise Ball'
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { setUser, completeOnboarding } = useHealthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      workHours: 8,
      duration: 20,
      workoutTime: '08:00',
      reminderTime: '08:00'
    }
  });

  const onSubmit = (data: OnboardingForm) => {
    const user = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      age: data.age,
      jobTitle: data.jobTitle,
      workHours: data.workHours,
      fitnessLevel: data.fitnessLevel,
      goals: data.goals,
      equipment: data.equipment,
      restrictions: [],
      preferences: {
        workoutTime: data.workoutTime,
        duration: data.duration,
        reminderTime: data.reminderTime
      }
    };

    setUser(user);
    completeOnboarding();
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    const newGoals = checked 
      ? [...selectedGoals, goal]
      : selectedGoals.filter(g => g !== goal);
    setSelectedGoals(newGoals);
    setValue('goals', newGoals);
  };

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    const newEquipment = checked 
      ? [...selectedEquipment, equipment]
      : selectedEquipment.filter(e => e !== equipment);
    setSelectedEquipment(newEquipment);
    setValue('equipment', newEquipment);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isCompleted 
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-xs sm:text-sm text-center ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Let's get to know you</h2>
                  <p className="text-muted-foreground">Help us personalize your fitness journey</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      placeholder="Enter your age"
                    />
                    {errors.age && (
                      <p className="text-destructive text-sm mt-1">{errors.age.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Work & Lifestyle */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Work & Lifestyle</h2>
                  <p className="text-muted-foreground">Tell us about your work routine</p>
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title / Role</Label>
                  <Input
                    id="jobTitle"
                    {...register('jobTitle')}
                    placeholder="e.g., Software Developer, System Admin"
                  />
                  {errors.jobTitle && (
                    <p className="text-destructive text-sm mt-1">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workHours">Work Hours per Day</Label>
                    <Input
                      id="workHours"
                      type="number"
                      {...register('workHours', { valueAsNumber: true })}
                      placeholder="8"
                    />
                    {errors.workHours && (
                      <p className="text-destructive text-sm mt-1">{errors.workHours.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fitnessLevel">Current Fitness Level</Label>
                    <Select onValueChange={(value) => setValue('fitnessLevel', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.fitnessLevel && (
                      <p className="text-destructive text-sm mt-1">{errors.fitnessLevel.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fitness Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Your Fitness Goals</h2>
                  <p className="text-muted-foreground">What do you want to achieve? (Select multiple)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fitnessGoals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={selectedGoals.includes(goal)}
                        onCheckedChange={(checked) => handleGoalChange(goal, !!checked)}
                      />
                      <Label htmlFor={goal}>{goal}</Label>
                    </div>
                  ))}
                </div>

                {errors.goals && (
                  <p className="text-destructive text-sm">{errors.goals.message}</p>
                )}
              </div>
            )}

            {/* Step 4: Equipment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Available Equipment</h2>
                  <p className="text-muted-foreground">What equipment do you have access to?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableEquipment.map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={selectedEquipment.includes(equipment)}
                        onCheckedChange={(checked) => handleEquipmentChange(equipment, !!checked)}
                      />
                      <Label htmlFor={equipment}>{equipment}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Workout Preferences</h2>
                  <p className="text-muted-foreground">Set up your workout schedule</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workoutTime">Preferred Workout Time</Label>
                    <Input
                      id="workoutTime"
                      type="time"
                      {...register('workoutTime')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Session Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      {...register('duration', { valueAsNumber: true })}
                      placeholder="20"
                    />
                    {errors.duration && (
                      <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="reminderTime">Daily Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    {...register('reminderTime')}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button type="submit">
                  Complete Setup
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}