import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Check } from 'lucide-react';
import { useAddToCart } from '../hooks/useCart';

interface AddToCartButtonProps {
  productId: bigint;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    await addToCart.mutateAsync({ productId, quantity: BigInt(quantity) });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="flex gap-2 w-full">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-20"
      />
      <Button
        onClick={handleAddToCart}
        disabled={addToCart.isPending || showSuccess}
        className="flex-1"
        variant={showSuccess ? 'secondary' : 'default'}
      >
        {addToCart.isPending ? (
          <>
            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Adding...
          </>
        ) : showSuccess ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
