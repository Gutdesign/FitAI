@@ .. @@
 import { useState } from 'react';
-import { Menu, X, MessageCircle, BarChart3, Calendar, User } from 'lucide-react';
+import { Menu, X, MessageCircle, BarChart3, Calendar, User, Home } from 'lucide-react';
 import { Button } from './ui/button';
 import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
+import { useHealthStore } from '../store/useHealthStore';

 const navigationItems = [
+  { id: 'dashboard', label: 'Dashboard', icon: Home },
   { id: 'chat', label: 'Чат', icon: MessageCircle },
   { id: 'stats', label: 'Статистика', icon: BarChart3 },
   { id: 'calendar', label: 'Календарь', icon: Calendar },
   { id: 'profile', label: 'Профиль', icon: User },
 ];

-interface NavigationProps {
-  activeTab: string;
-  onTabChange: (tab: string) => void;
-}
-
-export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
+export default function Navigation() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
+  const { activeTab, setActiveTab, user } = useHealthStore();

   const handleTabClick = (tabId: string) => {
-    onTabChange(tabId);
+    setActiveTab(tabId);
     setMobileMenuOpen(false);
   };

@@ .. @@
       {/* Mobile Navigation */}
       <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
         <div className="flex items-center justify-between p-4">
-          <h1 className="text-xl font-semibold">Фитнес</h1>
+          <div className="flex items-center gap-3">
+            <h1 className="text-xl font-semibold">Overall Health</h1>
+            {user && (
+              <span className="text-sm text-muted-foreground hidden sm:block">
+                Hi, {user.name.split(' ')[0]}
+              </span>
+            )}
+          </div>
           <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
@@ .. @@
       {/* Desktop Navigation */}
       <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
         <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
-          <h1 className="text-xl font-semibold">Фитнес</h1>
+          <div className="flex items-center gap-3">
+            <h1 className="text-xl font-semibold">Overall Health</h1>
+            {user && (
+              <span className="text-sm text-muted-foreground">
+                Hi, {user.name.split(' ')[0]}
+              </span>
+            )}
+          </div>
           <div className="flex space-x-1">
@@ .. @@
       {/* Fixed CTA Button */}
       <div className="fixed bottom-6 right-6 z-50">
         <Button
-          onClick={() => handleTabClick('chat')}
+          onClick={() => handleTabClick('dashboard')}
           className="h-14 px-6 rounded-full shadow-lg bg-primary hover:bg-primary/90"
         >
-          <MessageCircle className="h-5 w-5 mr-2" />
-          Перейти в чат
+          <Home className="h-5 w-5 mr-2" />
+          Dashboard
         </Button>
       </div>