import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useHealthStore } from '../store/useHealthStore';
import { Activity, Heart, Zap, Trophy, Calendar, Target, Play, Clock } from 'lucide-react';

export default function DashboardScreen() {
  const { workoutSessions, moodEntries, getWeeklyStats, getStreakDays, user, workouts, setActiveTab } = useHealthStore();

  const weeklyStats = getWeeklyStats();
  const streakDays = getStreakDays();

  // Quick stats
  const stats = [
    {
      title: 'Недельные тренировки',
      value: weeklyStats.workoutsCompleted,
      unit: 'сессий',
      icon: Activity,
      color: 'text-primary',
    },
    {
      title: 'Текущая серия',
      value: streakDays,
      unit: 'дней',
      icon: Trophy,
      color: 'text-orange-500',
    },
    {
      title: 'Средняя энергия',
      value: weeklyStats.averageEnergy > 0 ? weeklyStats.averageEnergy.toFixed(1) : '-',
      unit: '/5',
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      title: 'Минут в неделю',
      value: weeklyStats.totalMinutes,
      unit: 'мин',
      icon: Calendar,
      color: 'text-blue-500',
    },
  ];

  const quickWorkouts = [
    {
      id: 'desk-stretch',
      name: 'Растяжка на столе',
      duration: 3,
      type: 'flexibility',
      description: 'Быстрое снятие напряжения',
    },
    {
      id: 'energy-boost',
      name: 'Заряд энергии',
      duration: 5,
      type: 'cardio',
      description: 'Разгон крови кардио',
    },
    {
      id: 'posture-fix',
      name: 'Исправление осанки',
      duration: 4,
      type: 'strength',
      description: 'Противодействие сидению',
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-2">
          Добро пожаловать{user && `, ${user.name.split(' ')[0]}`}!
        </h1>
        <p className="text-muted-foreground">
          Фитнес-платформа для IT профессионалов с сидячим образом жизни
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold">
                        {stat.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Быстрые тренировки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <h4 className="font-medium">{workout.name}</h4>
                  <p className="text-sm text-muted-foreground">{workout.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {workout.duration}мин
                  </Badge>
                  <Button size="sm">
                    Старт
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('stats')}
            >
              <Heart className="h-4 w-4 mr-2" />
              Отследить настроение
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Запланировать тренировку
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('chat')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Получить совет ИИ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips for IT Professionals */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">💡 Совет дня для IT профессионала</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Каждые 25 минут работы делай 5-минутный перерыв. Встань, потянись, 
              сделай несколько глубоких вдохов. Твоя спина и глаза скажут спасибо!
            </p>
            <Button size="sm" onClick={() => setActiveTab('chat')}>
              Больше советов
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}