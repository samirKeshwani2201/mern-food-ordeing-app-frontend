import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProflieForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProflieForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation();
  const { isLoading: isGetUserLoading, currentUser } = useGetMyUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to checkout
      </Button>
    );
  }
  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="flex bg-orange-500 flex-1">
          Go to checkout
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-50 max-w-[425px] md:min-w-[700px]">
        <UserProflieForm
          currentUser={currentUser}
          isLoading={isGetUserLoading}
          onSave={onCheckout}
          title="Confirm Delivery Details"
          buttonText="Continue to payment"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
