import { Card } from './ui/card';
import { useHealthStore } from '../store/useHealthStore';
import { Activity, Heart, Zap, Trophy, Calendar, Target } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

export default function DashboardStats() {
  const { workoutSessions, moodEntries, getWeeklyStats, getStreakDays, user } = useHealthStore();

  const weeklyStats = getWeeklyStats();
  const streakDays = getStreakDays();

  // Today's mood if exists
  const todaysMood = moodEntries.find(entry => 
    isToday(parseISO(entry.date))
  );

  // This week's sessions
  const thisWeekSessions = workoutSessions.filter(session => {
    const sessionDate = parseISO(session.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo && session.completed;
  });

  // Goal progress (weekly target)
  const weeklyGoal = user?.preferences.duration ? Math.ceil((user.preferences.duration * 7) / 20) * 20 : 140; // minutes per week
  const goalProgress = (weeklyStats.totalMinutes / weeklyGoal) * 100;

  const stats = [
    {
      title: 'Weekly Workouts',
      value: weeklyStats.workoutsCompleted,
      unit: 'sessions',
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: thisWeekSessions.length > 0 ? '+' + thisWeekSessions.length : '0'
    },
    {
      title: 'Current Streak',
      value: streakDays,
      unit: 'days',
      icon: Trophy,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: streakDays > 0 ? '🔥' : '💪'
    },
    {
      title: 'Average Energy',
      value: weeklyStats.averageEnergy.toFixed(1),
      unit: '/5',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      change: weeklyStats.averageEnergy >= 3.5 ? '↗️' : weeklyStats.averageEnergy >= 2.5 ? '→' : '↘️'
    },
    {
      title: 'Weekly Minutes',
      value: weeklyStats.totalMinutes,
      unit: 'min',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      progress: Math.min(goalProgress, 100),
      change: `${Math.round(goalProgress)}%`
    },
    {
      title: "Today's Mood",
      value: todaysMood?.mood || '-',
      unit: todaysMood ? '/5' : '',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      change: todaysMood ? getMoodEmoji(todaysMood.mood) : '😊'
    },
    {
      title: 'Goal Progress',
      value: Math.round(goalProgress),
      unit: '%',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      progress: Math.min(goalProgress, 100),
      change: goalProgress >= 100 ? '✅' : goalProgress >= 75 ? '🎯' : '📈'
    }
  ];

  function getMoodEmoji(mood: number): string {
    if (mood >= 4.5) return '😄';
    if (mood >= 3.5) return '😊';
    if (mood >= 2.5) return '😐';
    if (mood >= 1.5) return '😟';
    return '😢';
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="p-3 sm:p-4 relative overflow-hidden">
            {/* Progress bar for applicable stats */}
            {stat.progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
            
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 line-clamp-2">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-semibold">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}