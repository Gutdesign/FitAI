import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { useHealthStore } from '../store/useHealthStore';
import { MoodEntry } from '../store/useHealthStore';
import { Heart, Zap, AlertTriangle, Moon, Calendar } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

interface MoodForm {
  mood: number[];
  energy: number[];
  stress: number[];
  sleep: number[];
  notes: string;
}

export default function MoodTracker() {
  const { addMoodEntry, moodEntries } = useHealthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user already logged mood today
  const todayEntry = moodEntries.find(entry => isToday(parseISO(entry.date)));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MoodForm>({
    defaultValues: {
      mood: [todayEntry?.mood || 3],
      energy: [todayEntry?.energy || 3],
      stress: [todayEntry?.stress || 3],
      sleep: [todayEntry?.sleep || 7],
      notes: todayEntry?.notes || ''
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: MoodForm) => {
    setIsSubmitting(true);
    
    try {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: data.mood[0],
        energy: data.energy[0],
        stress: data.stress[0],
        sleep: data.sleep[0],
        notes: data.notes || undefined
      };

      addMoodEntry(entry);
      
      // Success feedback could be added here
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
      
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 4.5) return '😄';
    if (value >= 3.5) return '😊';
    if (value >= 2.5) return '😐';
    if (value >= 1.5) return '😟';
    return '😢';
  };

  const getEnergyEmoji = (value: number) => {
    if (value >= 4.5) return '⚡';
    if (value >= 3.5) return '🔋';
    if (value >= 2.5) return '🔋';
    if (value >= 1.5) return '🪫';
    return '😴';
  };

  const getStressEmoji = (value: number) => {
    if (value >= 4.5) return '🤯';
    if (value >= 3.5) return '😰';
    if (value >= 2.5) return '😬';
    if (value >= 1.5) return '😌';
    return '😇';
  };

  // Recent entries for context
  const recentEntries = moodEntries
    .slice(-7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Daily Check-in</h3>
          {todayEntry && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              Updated today
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mood */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Mood {getMoodEmoji(watchedValues.mood?.[0] || 3)}</Label>
              <span className="text-sm text-muted-foreground ml-auto">
                {watchedValues.mood?.[0] || 3}/5
              </span>
            </div>
            
            <div className="px-2">
              <Slider
                value={watchedValues.mood || [3]}
                onValueChange={(value) => setValue('mood', value)}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Terrible</span>
              <span>Poor</span>
              <span>Okay</span>
              <span>Good</span>
              <span>Great</span>
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Energy {getEnergyEmoji(watchedValues.energy?.[0] || 3)}</Label>
              <span className="text-sm text-muted-foreground ml-auto">
                {watchedValues.energy?.[0] || 3}/5
              </span>
            </div>
            
            <div className="px-2">
              <Slider
                value={watchedValues.energy || [3]}
                onValueChange={(value) => setValue('energy', value)}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exhausted</span>
              <span>Tired</span>
              <span>Okay</span>
              <span>Energetic</span>
              <span>Pumped</span>
            </div>
          </div>

          {/* Stress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Stress {getStressEmoji(watchedValues.stress?.[0] || 3)}</Label>
              <span className="text-sm text-muted-foreground ml-auto">
                {watchedValues.stress?.[0] || 3}/5
              </span>
            </div>
            
            <div className="px-2">
              <Slider
                value={watchedValues.stress || [3]}
                onValueChange={(value) => setValue('stress', value)}
                max={5}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Zen</span>
              <span>Calm</span>
              <span>Neutral</span>
              <span>Stressed</span>
              <span>Overwhelmed</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <Label>Sleep (hours)</Label>
              <span className="text-sm text-muted-foreground ml-auto">
                {watchedValues.sleep?.[0] || 7}h
              </span>
            </div>
            
            <div className="px-2">
              <Slider
                value={watchedValues.sleep || [7]}
                onValueChange={(value) => setValue('sleep', value)}
                max={12}
                min={3}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3h</span>
              <span>6h</span>
              <span>8h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling today? Any specific challenges or wins?"
              {...register('notes')}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : todayEntry ? 'Update Check-in' : 'Save Check-in'}
          </Button>
        </form>
      </Card>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Recent Check-ins</h4>
          </div>
          
          <div className="space-y-3">
            {recentEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {format(parseISO(entry.date), 'MMM d')}
                  </span>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span title="Mood">{getMoodEmoji(entry.mood)}</span>
                    <span title="Energy">{getEnergyEmoji(entry.energy)}</span>
                    <span title="Stress">{getStressEmoji(entry.stress)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.sleep}h sleep</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}