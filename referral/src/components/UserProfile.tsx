import { useAuth } from 'react-oidc-context';
import { LogOut } from 'lucide-react';

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
    <div className="fixed top-5 right-5 z-50 shadow-lg bg-white rounded-lg border border-[#d9dfe2]">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#092433] text-white flex items-center justify-center font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#092433]">{userName}</span>
            {auth.user.profile?.email && (
              <span className="text-xs text-[#092433] opacity-60">{auth.user.profile.email}</span>
            )}
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full bg-[#ff4a50] hover:bg-[#dc3035] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );
};
