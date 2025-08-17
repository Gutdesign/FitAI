import { useState } from 'react';
import Navigation from './components/Navigation';
import ChatScreen from './components/ChatScreen';
import StatsScreen from './components/StatsScreen';
import CalendarScreen from './components/CalendarScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const renderScreen = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="pt-16 md:pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}