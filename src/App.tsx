@@ .. @@
 import { useState } from 'react';
+import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import Navigation from './components/Navigation';
 import ChatScreen from './components/ChatScreen';
 import StatsScreen from './components/StatsScreen';
 import CalendarScreen from './components/CalendarScreen';
 import ProfileScreen from './components/ProfileScreen';
+import Onboarding from './components/Onboarding';
+import DashboardStats from './components/DashboardStats';
+import { useHealthStore } from './store/useHealthStore';
+
+// Create a client
+const queryClient = new QueryClient();

 export default function App() {
-  const [activeTab, setActiveTab] = useState('chat');
+  const { activeTab, setActiveTab, isOnboarded } = useHealthStore();

   const renderScreen = () => {
@@ .. @@
       case 'chat':
         return <ChatScreen />;
       case 'stats':
         return <StatsScreen />;
+      case 'dashboard':
+        return (
+          <div className="p-4 space-y-6">
+            <div className="flex items-center justify-between">
+              <h1 className="text-2xl font-semibold">Health Dashboard</h1>
+              <span className="text-sm text-muted-foreground">
+                {new Date().toLocaleDateString('en-US', { 
+                  weekday: 'long', 
+                  year: 'numeric', 
+                  month: 'long', 
+                  day: 'numeric' 
+                })}
+              </span>
+            </div>
+            <DashboardStats />
+          </div>
+        );
       case 'calendar':
         return <CalendarScreen />;
       case 'profile':
         return <ProfileScreen />;
       default:
         return <ChatScreen />;
     }
   };

+  // Show onboarding if user hasn't completed it
+  if (!isOnboarded) {
+    return (
+      <QueryClientProvider client={queryClient}>
+        <Onboarding />
+      </QueryClientProvider>
+    );
+  }
+
   return (
+    <QueryClientProvider client={queryClient}>
       <div className="min-h-screen bg-background text-foreground dark">
         <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
         
         {/* Main Content */}
         <main className="pt-16 md:pt-20 pb-24 min-h-screen">
           <div className="max-w-7xl mx-auto">
             {renderScreen()}
           </div>
         </main>
       </div>
+    </QueryClientProvider>
   );
 }