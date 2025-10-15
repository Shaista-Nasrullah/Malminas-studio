// FILE: components/checkout/CheckoutForm.tsx

"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { ShippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { placeOrder } from "@/lib/actions/order.actions";

// --- THIS IS THE FINAL FIX ---
// We remove the `.default(false)` which was causing the conflict with the zodResolver.
// The default value is now handled exclusively by the useForm hook.
const clientSideCheckoutSchema = shippingAddressSchema.extend({
  email: z.string().email({ message: "Please enter a valid email." }),
  paymentMethod: z.string({ required_error: "A payment method is required." }),
  textMeWithNews: z.boolean(),
});

type CheckoutFormValues = z.infer<typeof clientSideCheckoutSchema>;

interface CheckoutFormProps {
  user: {
    id: string | null;
    email: string;
    address: ShippingAddress | null;
    paymentMethod: string | null;
  };
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(clientSideCheckoutSchema),
    // This part correctly sets the default value for the form state
    defaultValues: {
      ...(user.address || ShippingAddressDefaultValues),
      email: user.email || "",
      paymentMethod: user.paymentMethod || "CashOnDelivery",
      textMeWithNews: false,
    },
  });

  useEffect(() => {
    form.setValue("paymentMethod", user.paymentMethod || "CashOnDelivery");
  }, [form, user.paymentMethod]);

  const selectedPaymentMethod = form.watch("paymentMethod");

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (values) => {
    startTransition(async () => {
      try {
        const result = await placeOrder(values);
        if (result.success && result.redirectTo) {
          toast.success("Order placed successfully!");
          router.push(result.redirectTo);
        } else {
          toast.error("Failed to place order. Please try again.");
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          {user.id ? (
            <p className="text-sm text-gray-700">{user.email}</p>
          ) : (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Delivery</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Country/Region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Postal code (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone" {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textMeWithNews"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      Text me with news and offers
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Shipping method</h2>
          <div className="mt-4 border border-amber-500 bg-amber-50/50 rounded-lg p-4 flex justify-between items-center">
            <p className="text-sm">Standard Shipping</p>
            <p className="text-sm font-semibold">Rs 250.00</p>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Payment</h2>
          <p className="text-sm text-gray-500">
            All transactions are secure and encrypted.
          </p>
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="border border-gray-200 rounded-lg"
              >
                <div
                  className={cn(
                    "border-b border-gray-200",
                    selectedPaymentMethod === "CashOnDelivery" &&
                      "border-amber-500"
                  )}
                >
                  <div
                    className={cn(
                      "p-4",
                      selectedPaymentMethod === "CashOnDelivery" &&
                        "bg-amber-50/50"
                    )}
                  >
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="CashOnDelivery" id="cod" />
                      </FormControl>
                      <FormLabel
                        htmlFor="cod"
                        className="font-normal cursor-pointer"
                      >
                        Cash on Delivery (COD)
                      </FormLabel>
                    </FormItem>
                  </div>
                  {selectedPaymentMethod === "CashOnDelivery" && (
                    <div className="bg-gray-50/75 p-4 text-center text-sm text-gray-600 border-t border-gray-200">
                      PAY CASH ON DELIVERY
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "border-b border-gray-200",
                    selectedPaymentMethod === "JazzCash" && "border-amber-500"
                  )}
                >
                  <div
                    className={cn(
                      "p-4",
                      selectedPaymentMethod === "JazzCash" && "bg-amber-50/50"
                    )}
                  >
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="JazzCash" id="jazzcash" />
                      </FormControl>
                      <FormLabel
                        htmlFor="jazzcash"
                        className="font-normal cursor-pointer"
                      >
                        Jazz Cash/Easy Paisa
                      </FormLabel>
                    </FormItem>
                  </div>
                  {selectedPaymentMethod === "JazzCash" && (
                    <div className="bg-gray-50/75 p-4 pl-12 text-sm text-gray-600 border-t border-gray-200 space-y-1">
                      <p>
                        <span className="font-semibold">Jazz Cash:</span> 0333
                        8328 707 | Pairmin Kakar
                      </p>
                      <p>
                        <span className="font-semibold">Easy Paisa:</span> 0333
                        8328 707 | Pairmin Kakar
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    selectedPaymentMethod === "BankDeposit" &&
                      "border-amber-500"
                  )}
                >
                  <div
                    className={cn(
                      "p-4",
                      selectedPaymentMethod === "BankDeposit" &&
                        "bg-amber-50/50"
                    )}
                  >
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="BankDeposit" id="bank" />
                      </FormControl>
                      <FormLabel
                        htmlFor="bank"
                        className="font-normal cursor-pointer"
                      >
                        Bank Deposite
                      </FormLabel>
                    </FormItem>
                  </div>
                  {selectedPaymentMethod === "BankDeposit" && (
                    <div className="bg-gray-50/75 p-4 pl-12 text-sm text-gray-600 border-t border-gray-200 space-y-1">
                      <p>
                        <span className="font-semibold">ACCOUNT TITLE:</span>{" "}
                        Malminas Traditional studio
                      </p>
                      <p>
                        <span className="font-semibold">ACCOUNT #:</span> 0063
                      </p>
                      <p>
                        <span className="font-semibold">IBAN:</span> PK65
                      </p>
                      <p>
                        <span className="font-semibold">BANK NAME:</span> BANK
                        AL HABIB
                      </p>
                      <p>
                        <span className="font-semibold">BIC/SWIFT CODE:</span>{" "}
                        BAHL
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            )}
          />
        </section>
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base bg-[#8A7B20] hover:bg-[#7d6e1c] text-white"
          >
            {isPending && <Loader className="mr-2 h-5 w-5 animate-spin" />}
            Complete order
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
