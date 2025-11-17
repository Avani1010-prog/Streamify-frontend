import { Link, useLocation } from "react-router-dom"; // ✅ fixed import
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-14 md:h-16 flex items-center">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - Only visible on Chat Page */}
          {isChatPage && (
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 xl:gap-2.5">
                <ShipWheelIcon className="size-7 md:size-8 xl:size-9 text-primary flex-shrink-0" />
                <span className="text-xl md:text-2xl xl:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
            {/* Notifications */}
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle btn-sm md:btn-md">
                <BellIcon className="h-5 w-5 md:h-6 md:w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* ✅ Profile Avatar with Fallback */}
            <div className="avatar flex-shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    authUser?.profilePic
                      ? authUser.profilePic
                      : "/default-avatar.png"
                  }
                  alt={authUser?.fullName || "User Avatar"}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="btn btn-ghost btn-circle btn-sm md:btn-md"
              onClick={() => logoutMutation()}
            >
              <LogOutIcon className="h-5 w-5 md:h-6 md:w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
