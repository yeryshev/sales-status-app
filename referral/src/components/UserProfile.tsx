import { useAuth } from 'react-oidc-context';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const UserProfile = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const userName = auth.user.profile?.name || auth.user.profile?.preferred_username || auth.user.profile?.email || 'Unknown User';

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <Card className="fixed top-5 right-5 z-50 shadow-lg">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userName}</span>
            {auth.user.profile?.email && (
              <span className="text-xs text-muted-foreground">{auth.user.profile.email}</span>
            )}
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </Card>
  );
};

