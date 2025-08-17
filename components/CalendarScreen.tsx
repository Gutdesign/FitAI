import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface WorkoutDay {
  date: number;
  status: 'planned' | 'completed' | 'missed' | null;
  workout?: string;
  duration?: string;
}

const currentMonth = 'Декабрь 2024';
const daysInMonth = 31;
const firstDayOfWeek = 6; // Sunday (0-6, where 0 is Sunday)

const workoutData: Record<number, WorkoutDay> = {
  1: { date: 1, status: 'completed', workout: 'Силовая тренировка', duration: '45 мин' },
  3: { date: 3, status: 'planned', workout: 'Кардио', duration: '30 мин' },
  5: { date: 5, status: 'missed', workout: 'Йога', duration: '60 мин' },
  8: { date: 8, status: 'completed', workout: 'HIIT тренировка', duration: '25 мин' },
  10: { date: 10, status: 'planned', workout: 'Силовая тренировка', duration: '50 мин' },
  12: { date: 12, status: 'completed', workout: 'Растяжка', duration: '20 мин' },
  15: { date: 15, status: 'planned', workout: 'Кардио', duration: '40 мин' },
  17: { date: 17, status: 'missed', workout: 'Силовая тренировка', duration: '45 мин' },
  20: { date: 20, status: 'completed', workout: 'Плавание', duration: '60 мин' },
  22: { date: 22, status: 'planned', workout: 'Йога', duration: '45 мин' },
  24: { date: 24, status: 'planned', workout: 'HIIT тренировка', duration: '30 мин' },
};

const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const generateCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(workoutData[day] || { date: day, status: null });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDayClick = (day: WorkoutDay | null) => {
    if (day && day.workout) {
      setSelectedDay(day);
      setShowDetails(true);
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'planned':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'missed':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 border-green-500/30';
      case 'missed':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{currentMonth}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="p-4">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square p-1 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                day ? getStatusColor(day.status) : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <div className="h-full flex flex-col items-center justify-center text-sm">
                  <span className={day.status ? 'font-medium' : ''}>{day.date}</span>
                  {getStatusIcon(day.status)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-muted-foreground">Запланировано</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-muted-foreground">Выполнено</span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="text-muted-foreground">Пропущено</span>
        </div>
      </div>

      {/* Workout Details Modal/Sheet */}
      {showDetails && selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3>{selectedDay.date} декабря</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Тренировка</label>
                <p className="font-medium">{selectedDay.workout}</p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Длительность</label>
                <p className="font-medium">{selectedDay.duration}</p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Статус</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedDay.status)}
                  <Badge variant="secondary" className="capitalize">
                    {selectedDay.status === 'planned' && 'Запланировано'}
                    {selectedDay.status === 'completed' && 'Выполнено'}
                    {selectedDay.status === 'missed' && 'Пропущено'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              {selectedDay.status === 'planned' && (
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Начать тренировку
                </Button>
              )}
              {selectedDay.status === 'missed' && (
                <Button className="flex-1">
                  Перенести тренировку
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Закрыть
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}