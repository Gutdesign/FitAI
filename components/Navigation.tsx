import { useState } from 'react';
import { Menu, X, MessageCircle, BarChart3, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navigationItems = [
  { id: 'chat', label: 'Чат', icon: MessageCircle },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'profile', label: 'Профиль', icon: User },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Фитнес</h1>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="justify-start h-12"
                      onClick={() => handleTabClick(item.id)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold">Фитнес</h1>
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => handleTabClick(item.id)}
                  className="flex items-center space-x-2 px-4 py-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => handleTabClick('chat')}
          className="h-14 px-6 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Перейти в чат
        </Button>
      </div>
    </>
  );
}