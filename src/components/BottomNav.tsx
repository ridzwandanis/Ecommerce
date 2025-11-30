import { Home, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full border-t border-border bg-background/80 p-2 backdrop-blur-md">
      <div className="flex items-center justify-around">
        <Link to="/" className={`flex flex-col items-center gap-1 rounded-lg p-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link to="#search" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground">
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>

        <Link to="#wishlist" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground">
          <Heart className="h-6 w-6" />
          <span className="text-[10px] font-medium">Wishlist</span>
        </Link>

        <Link to="/account" className={`flex flex-col items-center gap-1 rounded-lg p-2 ${isActive('/account') ? 'text-primary' : 'text-muted-foreground'}`}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
