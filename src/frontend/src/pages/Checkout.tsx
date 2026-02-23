import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useQueries';
import { useCheckout } from '../hooks/useCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Checkout() {
  const { data: cartItems = [], isLoading: cartLoading } = useCart();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const isLoading = cartLoading || productsLoading;

  const cartWithProducts = cartItems
    .map((item) => ({
      item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((cp) => cp.product !== undefined);

  const total = cartWithProducts.reduce((sum, { item, product }) => {
    return sum + Number(product!.price) * Number(item.quantity);
  }, 0);

  const totalFormatted = (total / 100).toFixed(2);

  const handleCheckout = async () => {
    const orderId = await checkout.mutateAsync();
    navigate({ to: '/order-confirmation/$orderId', params: { orderId: orderId.toString() } });
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Add items to your cart before checkout</p>
            <Button onClick={() => navigate({ to: '/' })} size="lg">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartWithProducts.map(({ item, product }) => {
                const itemTotal = (Number(product!.price) * Number(item.quantity)) / 100;
                return (
                  <div key={item.productId.toString()} className="flex justify-between items-center">
                    <div className="flex gap-3 flex-1">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        <img
                          src={product!.image}
                          alt={product!.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product!.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity.toString()}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                  </div>
                );
              })}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totalFormatted}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complete Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Click the button below to complete your purchase. Your order will be processed securely.
            </p>
            <Button
              onClick={handleCheckout}
              disabled={checkout.isPending}
              size="lg"
              className="w-full"
            >
              {checkout.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Complete Purchase - ${totalFormatted}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
