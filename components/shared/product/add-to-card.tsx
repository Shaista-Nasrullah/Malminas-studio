"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
// --- 1. IMPORT Link from next/link ---
import Link from "next/link";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    // This part remains the same (quantity stepper for items already in cart)
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    // --- 2. THIS IS THE UPDATED SECTION ---
    // A flex container to stack the buttons vertically
    <div className="flex w-full flex-col gap-3">
      {/* Add to Cart Button is now the secondary action */}
      <Button
        variant="secondary" // CHANGED: This button is now styled as secondary
        className="w-full"
        type="button"
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        Add To Cart
      </Button>

      {/* "Buy it now" Button is now the default/primary action */}
      <Button
        asChild
        // CHANGED: The "variant" prop is removed, so it uses the default style
        className="w-full"
      >
        <Link href="/checkout">Buy it now</Link>
      </Button>
    </div>
  );
};

export default AddToCart;
