import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { CartItem, Product } from '../backend';
import { useRemoveFromCart, useAddToCart } from '../hooks/useCart';

interface CartItemRowProps {
  item: CartItem;
  product: Product;
}

export default function CartItemRow({ item, product }: CartItemRowProps) {
  const [quantity, setQuantity] = useState(Number(item.quantity));
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();

  useEffect(() => {
    setQuantity(Number(item.quantity));
  }, [item.quantity]);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    await addToCart.mutateAsync({ productId: item.productId, quantity: BigInt(newQuantity) });
  };

  const handleRemove = async () => {
    await removeFromCart.mutateAsync(item.productId);
  };

  const priceFormatted = (Number(product.price) / 100).toFixed(2);
  const subtotal = ((Number(product.price) * quantity) / 100).toFixed(2);

  return (
    <div className="flex gap-4 py-4 border-b border-border/50 last:border-0">
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <p className="text-sm font-medium">${priceFormatted} each</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
            disabled={addToCart.isPending}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={removeFromCart.isPending}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <p className="text-lg font-bold">${subtotal}</p>
      </div>
    </div>
  );
}
