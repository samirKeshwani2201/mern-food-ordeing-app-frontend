import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OrderStatusPage = () => {
  const { isLoading, orders } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-6 bg-gray-300 animate-pulse"></div>
        <div className="h-6 bg-gray-300 animate-pulse"></div>
        <div className="h-6 bg-gray-300 animate-pulse"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return "No order found";
  }

  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <div className="space-y-10 bg-gray-50 p-10 rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img src={order.restaurant.imageUrl} className="object-cover rounded-md w-full h-full" />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
