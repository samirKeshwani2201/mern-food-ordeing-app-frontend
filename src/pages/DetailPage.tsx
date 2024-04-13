// import { useUpdateMyUser } from "@/api/MyUserApi";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProflieForm";
import { MenuItem as MenuItemType } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { isLoading, restaurant } = useGetRestaurant(restaurantId);
  const { isLoading: isCheckoutLoading, createCheckoutSession } =
    useCreateCheckoutSession();
  // const { updateUser } = useUpdateMyUser();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartIems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartIems ? JSON.parse(storedCartIems) : [];
  });

  const addToCart = (menuItem: MenuItemType) => {
    // check if the item alredy in the cart
    // if ,then increase the quantity
    setCartItems((prevItems) => {
      const existingCartItem = prevItems.find(
        (item) => item._id === menuItem._id
      );
      let updatedCartItems;
      if (existingCartItem) {
        updatedCartItems = prevItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.filter(
        (item) => item._id !== cartItem._id
      );
      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }
    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        email: userFormData.email as string,
      },
    };
    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  if (isLoading || !restaurant) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-6 bg-gray-300 animate-pulse"></div>
        <div className="h-6 bg-gray-300 animate-pulse"></div>
        <div className="h-6 bg-gray-300 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          alt="restaurant image"
          className="rounded-md w-full h-full object-cover"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="tracking-tight font-bold text-2xl ">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem addToCart={addToCart} menuItem={menuItem} />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary
              removeFromCart={removeFromCart}
              restaurant={restaurant}
              cartItems={cartItems}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
