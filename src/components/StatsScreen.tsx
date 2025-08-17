import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, Heart, Target, Calendar, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useHealthStore } from '../store/useHealthStore';
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns';

const periods = ['Week', 'Month', '3 Months', 'Year'];

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [isEmpty, setIsEmpty] = useState(false);
  const { moodEntries, workoutSessions, getWeeklyStats } = useHealthStore();

  // Generate chart data based on mood entries
  const generateChartData = () => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const moodEntry = moodEntries.find(entry => 
        entry.date.startsWith(dayStr)
      );
      
      const workoutSession = workoutSessions.find(session => 
        session.date.startsWith(dayStr) && session.completed
      );

      return {
        date: format(day, 'MMM d'),
        mood: moodEntry?.mood || null,
        energy: moodEntry?.energy || null,
        stress: moodEntry?.stress || null,
        workout: workoutSession ? 1 : 0
      };
    });
  };

  const chartData = generateChartData();
  const weeklyStats = getWeeklyStats();

  // Check if user has any data
  const hasData = moodEntries.length > 0 || workoutSessions.length > 0;

  if (!hasData || isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No data yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Start working out and tracking your mood to see your health statistics and progress
        </p>
        <div className="space-y-2">
          <Button onClick={() => setIsEmpty(false)}>
            Start Tracking
          </Button>
          <p className="text-xs text-muted-foreground">
            (Demo mode - showing sample data)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Health Analytics</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEmpty(true)}
          className="text-muted-foreground"
        >
          Clear data (demo)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">Weekly Workouts</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-semibold mb-1">{weeklyStats.workoutsCompleted}</div>
          <p className="text-sm text-muted-foreground">sessions completed</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-medium">Average Mood</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-semibold mb-1">
            {weeklyStats.averageMood > 0 ? weeklyStats.averageMood.toFixed(1) : '-'}/5
          </div>
          <p className="text-sm text-muted-foreground">
            {weeklyStats.averageMood >= 4 ? 'Great mood!' : 
             weeklyStats.averageMood >= 3 ? 'Good overall' : 
             weeklyStats.averageMood > 0 ? 'Room for improvement' : 'Start tracking'}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Total Minutes</span>
            </div>
          </div>
          <div className="text-2xl font-semibold mb-1">{weeklyStats.totalMinutes}</div>
          <p className="text-sm text-muted-foreground">this week</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Energy Level</span>
            </div>
          </div>
          <div className="text-2xl font-semibold mb-1">
            {weeklyStats.averageEnergy > 0 ? weeklyStats.averageEnergy.toFixed(1) : '-'}/5
          </div>
          <p className="text-sm text-muted-foreground">average this week</p>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Mood & Energy Trends</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEmpty(true)}
            className="text-muted-foreground"
          >
            Clear data
          </Button>
        </div>

        {/* Period Filter */}
        <div className="flex space-x-2 mb-6">
          {periods.map((period) => (
            <Badge
              key={period}
              variant={selectedPeriod === period ? "default" : "secondary"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Badge>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141416',
                  border: '1px solid #2a2a2c',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#22C55E"
                strokeWidth={2}
                fill="url(#moodGradient)"
                name="Mood"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#energyGradient)"
                name="Energy"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Mood</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Energy</span>
            </div>
          </div>
          <div className="text-right">
            <div>Poor (1) → Great (5)</div>
          </div>
        </div>
      </Card>
    </div>
  );
}