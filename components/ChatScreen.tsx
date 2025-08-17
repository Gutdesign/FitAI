import { useState } from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

const scenarios = [
  'Составить план тренировки',
  'Помочь с питанием',
  'Мотивация',
  'Отчет о прогрессе',
  'Упражнения для дома',
];

const chatMessages = [
  {
    id: 1,
    type: 'agent',
    text: 'Привет! Я твой фитнес-помощник. Как дела с тренировками?',
    timestamp: '10:30',
    actions: ['Отлично!', 'Есть вопросы', 'Пропустил тренировку']
  },
  {
    id: 2,
    type: 'user',
    text: 'Привет! Пропустил вчера тренировку, чувствую вину',
    timestamp: '10:32',
  },
  {
    id: 3,
    type: 'agent',
    text: 'Не переживай! Главное - не останавливаться. Давай составим план на сегодня, чтобы вернуться в ритм. Сколько времени у тебя есть?',
    timestamp: '10:33',
    actions: ['30 минут', '1 час', 'Больше часа']
  }
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleScenarioClick = (scenario: string) => {
    setSelectedScenario(scenario);
    setMessage(scenario);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      setSelectedScenario(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scenarios */}
      <div className="p-4 border-b border-border">
        <h3 className="mb-3">Быстрые сценарии</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scenarios.map((scenario, index) => (
            <Badge
              key={index}
              variant={selectedScenario === scenario ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap px-3 py-2 rounded-full"
              onClick={() => handleScenarioClick(scenario)}
            >
              {scenario}
            </Badge>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
              <Card className={`p-3 ${msg.type === 'user' 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-card'}`}>
                <p className="text-sm mb-1">{msg.text}</p>
                <span className="text-xs opacity-70">{msg.timestamp}</span>
              </Card>
              
              {/* Quick Actions */}
              {msg.actions && msg.type === 'agent' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 h-7 rounded-full"
                      onClick={() => setMessage(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              className="pr-12 rounded-full"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSendMessage} size="icon" className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}