import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Set authUser to null immediately to trigger redirect
      queryClient.setQueryData(["authUser"], null);
      
      // Clear all cached queries
      queryClient.clear();
      
      // Mark as logged out in localStorage (frontend-side flag)
      localStorage.setItem("isLoggedOut", "true");
      
      toast.success("Logged out successfully!");
      
      // Force redirect to login with replace to prevent back navigation
      window.location.replace("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    },
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
              disabled={isPending}
              title="Logout"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <LogOutIcon className="h-5 w-5 md:h-6 md:w-6 text-base-content opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
