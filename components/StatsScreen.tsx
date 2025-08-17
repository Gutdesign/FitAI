import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, Heart, Target, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const moodData = [
  { date: '1 дек', mood: 3, energy: 4 },
  { date: '2 дек', mood: 4, energy: 3 },
  { date: '3 дек', mood: 5, energy: 5 },
  { date: '4 дек', mood: 3, energy: 2 },
  { date: '5 дек', mood: 4, energy: 4 },
  { date: '6 дек', mood: 5, energy: 4 },
  { date: '7 дек', mood: 4, energy: 5 },
];

const periods = ['Неделя', 'Месяц', '3 месяца', 'Год'];

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Неделя');
  const [isEmpty, setIsEmpty] = useState(false);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mb-2">Пока нет данных</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Начните тренироваться, чтобы увидеть статистику и отслеживать прогресс
        </p>
        <Button onClick={() => setIsEmpty(false)}>
          Начать тренировки
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">Спасенные дни</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-semibold mb-1">12</div>
          <p className="text-sm text-muted-foreground">+3 за эту неделю</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-medium">Удовлетворенность</span>
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-semibold mb-1">4.2/5</div>
          <p className="text-sm text-muted-foreground">Отличный результат!</p>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>График настроения</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEmpty(true)}
            className="text-muted-foreground"
          >
            Очистить данные
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
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                domain={[1, 5]}
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
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground mt-4">
          <span>Плохо (1)</span>
          <span>Отлично (5)</span>
        </div>
      </Card>
    </div>
  );
}