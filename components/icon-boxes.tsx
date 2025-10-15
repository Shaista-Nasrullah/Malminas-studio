import { Currency, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="wrapper grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Shipping Cost</div>
            <div className="text-sm text-muted-foreground">
              Based on weight & location
            </div>
          </div>
          <div className="space-y-2">
            <Currency />
            <div className="text-sm font-bold">
              Product Replacement Guarantee
            </div>
            <div className="text-sm text-muted-foreground">
              If customer is not satisfied
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Flexible Payment</div>
            <div className="text-sm text-muted-foreground">
              Pay with credit card, JazzCash or COD
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">24/7 Support</div>
            <div className="text-sm text-muted-foreground">
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
