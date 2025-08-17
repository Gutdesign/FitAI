import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useHealthStore } from '../store/useHealthStore';
import { User2, Briefcase, Target, CheckCircle } from 'lucide-react';

interface OnboardingData {
  name: string;
  email: string;
  age: number;
  jobTitle: string;
  workHours: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  equipment: string[];
}

const steps = [
  { id: 1, title: 'Личная информация', icon: User2 },
  { id: 2, title: 'Работа и образ жизни', icon: Briefcase },
  { id: 3, title: 'Фитнес цели', icon: Target },
  { id: 4, title: 'Готово!', icon: CheckCircle }
];

const fitnessGoals = [
  'Снижение веса',
  'Наращивание мышц',
  'Снятие стресса',
  'Улучшение осанки',
  'Повышение энергии',
  'Лучший сон',
  'Общая физическая форма',
  'Гибкость'
];

const availableEquipment = [
  'Без оборудования (только вес тела)',
  'Эспандер',
  'Гантели',
  'Гиря',
  'Коврик для йоги',
  'Турник',
  'Массажный ролик',
  'Фитбол'
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    goals: [],
    equipment: []
  });
  const { setUser, completeOnboarding } = useHealthStore();

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'goals' | 'equipment', item: string) => {
    const current = formData[field] || [];
    const updated = current.includes(item) 
      ? current.filter(i => i !== item)
      : [...current, item];
    updateFormData(field, updated);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = () => {
    const user = {
      id: Date.now().toString(),
      name: formData.name || 'Пользователь',
      email: formData.email || '',
      age: formData.age || 35,
      jobTitle: formData.jobTitle || 'IT специалист',
      workHours: formData.workHours || 8,
      fitnessLevel: formData.fitnessLevel || 'beginner',
      goals: formData.goals || ['Улучшение осанки'],
      equipment: formData.equipment || ['Без оборудования'],
      restrictions: [],
      preferences: {
        workoutTime: '08:00',
        duration: 20,
        reminderTime: '08:00'
      }
    };

    setUser(user);
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isCompleted 
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-xs sm:text-sm text-center ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-center">Давайте знакомиться</CardTitle>
                  <p className="text-center text-muted-foreground">
                    Помогите нам персонализировать ваш фитнес-путь
                  </p>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Полное имя</label>
                    <Input
                      placeholder="Введите ваше имя"
                      value={formData.name || ''}
                      onChange={(e) => updateFormData('name', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email || ''}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Возраст</label>
                      <Input
                        type="number"
                        placeholder="35"
                        value={formData.age || ''}
                        onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Work & Lifestyle */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-center">Работа и образ жизни</CardTitle>
                  <p className="text-center text-muted-foreground">
                    Расскажите о вашем рабочем режиме
                  </p>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Должность</label>
                    <Input
                      placeholder="например: Разработчик ПО, Системный администратор"
                      value={formData.jobTitle || ''}
                      onChange={(e) => updateFormData('jobTitle', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Рабочих часов в день</label>
                      <Input
                        type="number"
                        placeholder="8"
                        value={formData.workHours || ''}
                        onChange={(e) => updateFormData('workHours', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Уровень физической подготовки</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                          <Button
                            key={level}
                            variant={formData.fitnessLevel === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateFormData('fitnessLevel', level)}
                          >
                            {level === 'beginner' ? 'Начинающий' : 
                             level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-center">Ваши фитнес цели</CardTitle>
                  <p className="text-center text-muted-foreground">
                    Чего вы хотите достичь? (Выберите несколько)
                  </p>
                </CardHeader>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Цели</label>
                    <div className="grid grid-cols-2 gap-2">
                      {fitnessGoals.map((goal) => (
                        <Button
                          key={goal}
                          variant={formData.goals?.includes(goal) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArrayItem('goals', goal)}
                        >
                          {goal}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Доступное оборудование</label>
                    <div className="grid grid-cols-1 gap-2">
                      {availableEquipment.slice(0, 4).map((equipment) => (
                        <Button
                          key={equipment}
                          variant={formData.equipment?.includes(equipment) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArrayItem('equipment', equipment)}
                        >
                          {equipment}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-center">Всё готово! 🎉</CardTitle>
                  <p className="text-center text-muted-foreground">
                    Ваш персональный фитнес-план готов
                  </p>
                </CardHeader>

                <div className="text-center space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Ваш профиль:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>👤 {formData.name}, {formData.age} лет</p>
                      <p>💼 {formData.jobTitle}</p>
                      <p>🎯 {formData.goals?.length} целей выбрано</p>
                      <p>⚡ Уровень: {
                        formData.fitnessLevel === 'beginner' ? 'Начинающий' :
                        formData.fitnessLevel === 'intermediate' ? 'Средний' : 'Продвинутый'
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Назад
              </Button>

              {currentStep === steps.length ? (
                <Button onClick={completeSetup}>
                  Начать путешествие!
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Далее
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}