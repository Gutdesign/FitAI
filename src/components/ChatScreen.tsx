@@ .. @@
 import { useState } from 'react';
 import { Send, Mic, Plus } from 'lucide-react';
 import { Button } from './ui/button';
 import { Input } from './ui/input';
 import { Badge } from './ui/badge';
 import { Card } from './ui/card';
+import QuickWorkouts from './QuickWorkouts';
+import MoodTracker from './MoodTracker';
+import { useHealthStore } from '../store/useHealthStore';

 const scenarios = [
-  'Составить план тренировки',
-  'Помочь с питанием',
-  'Мотивация',
-  'Отчет о прогрессе',
-  'Упражнения для дома',
+  'Create workout plan',
+  'Desk exercises',
+  'Stress relief tips',
+  'Progress report',
+  'Healthy habits',
+  'Time management'
 ];

 const chatMessages = [
   {
     id: 1,
     type: 'agent',
-    text: 'Привет! Я твой фитнес-помощник. Как дела с тренировками?',
-    timestamp: '10:30',
-    actions: ['Отлично!', 'Есть вопросы', 'Пропустил тренировку']
+    text: 'Hi there! I\'m your AI fitness assistant for busy IT professionals. How can I help you stay healthy today?',
+    timestamp: '10:30',
+    actions: ['Need quick workout', 'Feeling stressed', 'Track my mood']
   },
   {
     id: 2,
     type: 'user',
-    text: 'Привет! Пропустил вчера тренировку, чувствую вину',
+    text: 'Hi! I missed my workout yesterday and feeling guilty about it',
     timestamp: '10:32',
   },
   {
     id: 3,
     type: 'agent',
-    text: 'Не переживай! Главное - не останавливаться. Давай составим план на сегодня, чтобы вернуться в ритм. Сколько времени у тебя есть?',
+    text: 'No worries! What matters is getting back on track. Let\'s create a plan for today. How much time do you have available?',
     timestamp: '10:33',
-    actions: ['30 минут', '1 час', 'Больше часа']
+    actions: ['5-10 minutes', '15-30 minutes', '30+ minutes']
   }
 ];

 export default function ChatScreen() {
   const [message, setMessage] = useState('');
   const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
+  const [showQuickWorkouts, setShowQuickWorkouts] = useState(false);
+  const [showMoodTracker, setShowMoodTracker] = useState(false);
+  const { user } = useHealthStore();

   const handleScenarioClick = (scenario: string) => {
     setSelectedScenario(scenario);
     setMessage(scenario);
   };

+  const handleQuickAction = (action: string) => {
+    switch (action) {
+      case 'Need quick workout':
+        setShowQuickWorkouts(true);
+        break;
+      case 'Track my mood':
+        setShowMoodTracker(true);
+        break;
+      default:
+        setMessage(action);
+    }
+  };

   const handleSendMessage = () => {
     if (message.trim()) {
       console.log('Sending message:', message);
       setMessage('');
       setSelectedScenario(null);
     }
   };

+  // Show different content based on what user wants to do
+  if (showQuickWorkouts) {
+    return (
+      <div className="p-4">
+        <div className="flex items-center justify-between mb-6">
+          <h2 className="text-xl font-semibold">Quick Workouts</h2>
+          <Button variant="outline" onClick={() => setShowQuickWorkouts(false)}>
+            Back to Chat
+          </Button>
+        </div>
+        <QuickWorkouts />
+      </div>
+    );
+  }
+
+  if (showMoodTracker) {
+    return (
+      <div className="p-4">
+        <div className="flex items-center justify-between mb-6">
+          <h2 className="text-xl font-semibold">Mood Tracker</h2>
+          <Button variant="outline" onClick={() => setShowMoodTracker(false)}>
+            Back to Chat
+          </Button>
+        </div>
+        <MoodTracker />
+      </div>
+    );
+  }

   return (
     <div className="flex flex-col h-full">
+      {/* Welcome Message for IT Professionals */}
+      <div className="p-4 border-b border-border bg-primary/5">
+        <div className="max-w-3xl mx-auto">
+          <h2 className="text-lg font-semibold mb-2">
+            Welcome to your Health Assistant
+            {user && <span>, {user.name.split(' ')[0]}</span>}
+          </h2>
+          <p className="text-sm text-muted-foreground">
+            Designed specifically for busy IT professionals. Get personalized fitness advice, 
+            quick desk exercises, stress management tips, and track your wellbeing.
+          </p>
+        </div>
+      </div>
+
       {/* Scenarios */}
       <div className="p-4 border-b border-border">
-        <h3 className="mb-3">Быстрые сценарии</h3>
+        <h3 className="mb-3">Quick Actions</h3>
         <div className="flex gap-2 overflow-x-auto pb-2">
           {scenarios.map((scenario, index) => (
             <Badge
@@ .. @@
                   {msg.actions.map((action, index) => (
                     <Button
                       key={index}
                       variant="outline"
                       size="sm"
                       className="text-xs px-3 py-1 h-7 rounded-full"
-                      onClick={() => setMessage(action)}
+                      onClick={() => handleQuickAction(action)}
                     >
                       {action}
                     </Button>
@@ .. @@
             <Input
               value={message}
               onChange={(e) => setMessage(e.target.value)}
-              placeholder="Напишите сообщение..."
+              placeholder="Ask me anything about fitness, health, or stress management..."
               className="pr-12 rounded-full"
               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
             />
@@ .. @@
   );
 }