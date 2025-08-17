import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3 } from "lucide-react";

export default function StatsScreen() {
  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Statistics</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Health Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Statistics feature coming soon...</p>
              <p className="text-sm">View detailed analytics of your health progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}