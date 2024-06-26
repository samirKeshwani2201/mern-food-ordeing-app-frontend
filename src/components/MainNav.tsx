import { Link } from "react-router-dom";
import UsernameMenu from "./UsernameMenu";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { LogIn } from "lucide-react";
const MainNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <span className="flex space-x-2 items-center">
      {isAuthenticated ? (
        <>
          <Link to="/order-status" className="font-bold hover:text-orange-500">Order Status</Link>
          <UsernameMenu />
        </>
      ) : (
        <Button
          variant="ghost"
          className="font-bold hover:text-orange-500 hover:bg-white"
          onClick={async () => await loginWithRedirect()}
        >
          <LogIn className="w-4 h-4 mt-0.5 mr-2" /> Login
        </Button>
      )}
    </span>
  );
};

export default MainNav;
