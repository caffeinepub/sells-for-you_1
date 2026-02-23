import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, History } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from '@tanstack/react-router';

export default function AuthButton() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isLoggingIn || loginStatus === 'initializing') {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="default" size="sm" onClick={login}>
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
    );
  }

  const principalText = identity.getPrincipal().toString();
  const shortPrincipal = `${principalText.slice(0, 5)}...${principalText.slice(-3)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          {shortPrincipal}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/orders' })}>
          <History className="h-4 w-4 mr-2" />
          Order History
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clear}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
