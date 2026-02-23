import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from './AuthButton';
import { useCart } from '../hooks/useCart';

export default function Layout() {
  const navigate = useNavigate();
  const { data: cartItems = [] } = useCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Sells For You
            </span>
          </Link>

          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 mt-auto">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Sells For You</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Built with <Heart className="h-3 w-3 text-destructive fill-destructive" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'sells-for-you'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-foreground transition-colors underline"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
