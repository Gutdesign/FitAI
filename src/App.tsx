import { useHealthStore } from './store/useHealthStore';
import Navigation from './components/Navigation';
import DashboardScreen from './components/DashboardScreen';
import ChatScreen from './components/ChatScreen';
import StatsScreen from './components/StatsScreen';
import CalendarScreen from './components/CalendarScreen';
import ProfileScreen from './components/ProfileScreen';
import Onboarding from './components/Onboarding';

export default function App() {
  const { activeTab, isOnboarded } = useHealthStore();

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Show onboarding if user hasn't completed it
  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-20 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}