import { useState } from 'react';
import { Send, Mic, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import QuickWorkouts from './QuickWorkouts';
import MoodTracker from './MoodTracker';
import { useHealthStore } from '../store/useHealthStore';

const scenarios = [
  'Create workout plan',
  'Desk exercises',
  'Stress relief tips',
  'Progress report',
  'Healthy habits',
  'Time management'
];

const chatMessages = [
  {
    id: 1,
    type: 'agent',
    text: 'Hi there! I\'m your AI fitness assistant for busy IT professionals. How can I help you stay healthy today?',
    timestamp: '10:30',
    actions: ['Need quick workout', 'Feeling stressed', 'Track my mood']
  },
  {
    id: 2,
    type: 'user',
    text: 'Hi! I missed my workout yesterday and feeling guilty about it',
    timestamp: '10:32',
  },
  {
    id: 3,
    type: 'agent',
    text: 'No worries! What matters is getting back on track. Let\'s create a plan for today. How much time do you have available?',
    timestamp: '10:33',
    actions: ['5-10 minutes', '15-30 minutes', '30+ minutes']
  }
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showQuickWorkouts, setShowQuickWorkouts] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const { user } = useHealthStore();

  const handleScenarioClick = (scenario: string) => {
    setSelectedScenario(scenario);
    setMessage(scenario);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Need quick workout':
        setShowQuickWorkouts(true);
        break;
      case 'Track my mood':
        setShowMoodTracker(true);
        break;
      default:
        setMessage(action);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      setSelectedScenario(null);
    }
  };

  // Show different content based on what user wants to do
  if (showQuickWorkouts) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Quick Workouts</h2>
          <Button variant="outline" onClick={() => setShowQuickWorkouts(false)}>
            Back to Chat
          </Button>
        </div>
        <QuickWorkouts />
      </div>
    );
  }

  if (showMoodTracker) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Mood Tracker</h2>
          <Button variant="outline" onClick={() => setShowMoodTracker(false)}>
            Back to Chat
          </Button>
        </div>
        <MoodTracker />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Message for IT Professionals */}
      <div className="p-4 border-b border-border bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">
            Welcome to your Health Assistant
            {user && <span>, {user.name.split(' ')[0]}</span>}
          </h2>
          <p className="text-sm text-muted-foreground">
            Designed specifically for busy IT professionals. Get personalized fitness advice, 
            quick desk exercises, stress management tips, and track your wellbeing.
          </p>
        </div>
      </div>

      {/* Scenarios */}
      <div className="p-4 border-b border-border">
        <h3 className="mb-3">Quick Actions</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scenarios.map((scenario, index) => (
            <Badge
              key={index}
              variant={selectedScenario === scenario ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap"
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
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
              <Card className={`p-3 ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </Card>
              
              {msg.actions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 h-7 rounded-full"
                      onClick={() => handleQuickAction(action)}
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

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about fitness, health, or stress management..."
              className="pr-12 rounded-full"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}