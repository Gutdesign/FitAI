import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar } from "lucide-react";

export default function CalendarScreen() {
  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Health Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Calendar feature coming soon...</p>
              <p className="text-sm">Track your workouts, mood, and health events</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}