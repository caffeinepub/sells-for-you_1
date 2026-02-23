import { useParams, useNavigate } from '@tanstack/react-router';
import { useOrder } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Order not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalFormatted = (Number(order.totalAmount) / 100).toFixed(2);

  return (
    <div className="container py-8 max-w-2xl">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground">Thank you for your purchase</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold">#{order.id.toString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="text-xl font-bold">${totalFormatted}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded-lg"
                >
                  <span className="text-sm">Product #{item.productId.toString()}</span>
                  <span className="text-sm font-medium">Qty: {item.quantity.toString()}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate({ to: '/orders' })} variant="outline" className="flex-1">
              View Order History
            </Button>
            <Button onClick={() => navigate({ to: '/' })} className="flex-1">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
