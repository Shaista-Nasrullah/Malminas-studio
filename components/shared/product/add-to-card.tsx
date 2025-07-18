"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  // --- 1. CREATE SEPARATE TRANSITION STATES ---
  // Each action gets its own state to track its loading status independently.
  const [isAddToCartPending, startAddToCartTransition] = useTransition();
  const [isBuyNowPending, startBuyNowTransition] = useTransition();
  const [isRemoveItemPending, startRemoveItemTransition] = useTransition();

  const handleAddToCart = async () => {
    // Use the specific transition for this action
    startAddToCartTransition(async () => {
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

  const handleBuyNow = async () => {
    // Use the specific transition for this action
    startBuyNowTransition(async () => {
      const res = await addItemToCart(item);
      if (res.success) {
        router.push("/checkout");
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleRemoveFromCart = async () => {
    // Use the specific transition for this action
    startRemoveItemTransition(async () => {
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

  // Disable all buttons if ANY action is pending to prevent conflicts.
  const anyActionIsPending =
    isAddToCartPending || isBuyNowPending || isRemoveItemPending;

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={anyActionIsPending}
      >
        {/* --- 2. USE INDIVIDUAL PENDING STATE --- */}
        {isRemoveItemPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={anyActionIsPending}
      >
        {/* --- 2. USE INDIVIDUAL PENDING STATE --- */}
        {isAddToCartPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <div className="flex w-full flex-col gap-3">
      <Button
        variant="secondary"
        className="w-full"
        type="button"
        disabled={anyActionIsPending}
        onClick={handleAddToCart}
      >
        {/* --- 2. USE INDIVIDUAL PENDING STATE --- */}
        {isAddToCartPending ? (
          <Loader className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        Add To Cart
      </Button>

      <Button
        className="w-full"
        type="button"
        disabled={anyActionIsPending}
        onClick={handleBuyNow}
      >
        {/* --- 2. USE INDIVIDUAL PENDING STATE --- */}
        {isBuyNowPending && <Loader className="w-4 h-4 animate-spin mr-2" />}
        Buy it now
      </Button>
    </div>
  );
};

export default AddToCart;
