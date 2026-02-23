import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function OrderHistory() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  // Note: Backend doesn't have a method to get user's order history
  // This is a placeholder implementation

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>No Orders Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your order history will appear here once you make your first purchase.
          </p>
          <Button onClick={() => navigate({ to: '/' })} size="lg">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
