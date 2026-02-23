import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useQueries';
import CartItemRow from '../components/CartItemRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ShoppingCart() {
  const { data: cartItems = [], isLoading: cartLoading } = useCart();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

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
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => navigate({ to: '/' })} size="lg">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cartWithProducts.map(({ item, product }) => (
                <CartItemRow key={item.productId.toString()} item={item} product={product!} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalFormatted}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totalFormatted}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate({ to: '/checkout' })}
                  size="lg"
                  className="w-full"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button onClick={login} size="lg" className="w-full">
                    Login to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Please login to complete your purchase securely
                  </p>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
