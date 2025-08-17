import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User } from "lucide-react";

export default function ProfileScreen() {
  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Profile settings coming soon...</p>
              <p className="text-sm">Manage your account and preferences</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}