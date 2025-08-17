import { useState } from 'react';
import { Camera, Clock, Dumbbell, Heart, Settings, Link } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function ProfileScreen() {
  const [workoutTime, setWorkoutTime] = useState('08:00');
  const [stravaConnected, setStravaConnected] = useState(true);
  const [polarConnected, setPolarConnected] = useState(false);

  const user = {
    name: 'Анна Петрова',
    avatar: null,
    level: 'Продвинутый',
    goals: ['Похудение', 'Выносливость', 'Тонус'],
    equipment: ['Гантели', 'Коврик', 'Эспандер'],
    restrictions: ['Проблемы с коленями'],
    streak: 12,
    totalWorkouts: 48,
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
            <Badge variant="secondary" className="mb-2">{user.level}</Badge>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>🔥 {user.streak} дней подряд</span>
              <span>💪 {user.totalWorkouts} тренировок</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" />
          Цели
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.goals.map((goal, index) => (
            <Badge key={index} variant="outline">
              {goal}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-6 space-y-6">
        <h3 className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          Настройки
        </h3>

        {/* Workout Time */}
        <div className="space-y-2">
          <Label htmlFor="workout-time" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Время тренировок
          </Label>
          <Input
            id="workout-time"
            type="time"
            value={workoutTime}
            onChange={(e) => setWorkoutTime(e.target.value)}
            className="w-32"
          />
        </div>

        {/* Equipment */}
        <div className="space-y-3">
          <Label className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-2" />
            Доступное оборудование
          </Label>
          <div className="flex flex-wrap gap-2">
            {user.equipment.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
              + Добавить
            </Button>
          </div>
        </div>

        {/* Restrictions */}
        <div className="space-y-3">
          <Label>Ограничения и особенности</Label>
          <div className="flex flex-wrap gap-2">
            {user.restrictions.map((restriction, index) => (
              <Badge key={index} variant="destructive">
                {restriction}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
              + Добавить
            </Button>
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6 space-y-4">
        <h3 className="flex items-center">
          <Link className="h-5 w-5 mr-2 text-primary" />
          Интеграции
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="font-medium">Strava</p>
                <p className="text-sm text-muted-foreground">
                  {stravaConnected ? 'Подключено' : 'Не подключено'}
                </p>
              </div>
            </div>
            <Switch
              checked={stravaConnected}
              onCheckedChange={setStravaConnected}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <p className="font-medium">Polar</p>
                <p className="text-sm text-muted-foreground">
                  {polarConnected ? 'Подключено' : 'Не подключено'}
                </p>
              </div>
            </div>
            <Switch
              checked={polarConnected}
              onCheckedChange={setPolarConnected}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          Экспорт данных
        </Button>
        <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}