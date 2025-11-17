import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { Bell, Home, ShipWheel, User } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 xl:w-72 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-full shadow-md overflow-hidden">
      {/* ---- LOGO SECTION ---- */}
      <div className="p-4 xl:p-6 border-b border-base-300 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 xl:gap-3 group">
          <ShipWheel className="w-8 h-8 xl:w-10 xl:h-10 text-primary group-hover:rotate-12 transition-transform flex-shrink-0" />
          <span className="text-2xl xl:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            Streamify
          </span>
        </Link>
      </div>

      {/* ---- NAVIGATION ---- */}
      <nav className="flex-1 p-4 xl:p-5 space-y-2 overflow-y-auto min-h-0">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 text-sm xl:text-base font-medium normal-case ${
            currentPath === "/" ? "btn-active bg-base-300" : "hover:bg-base-300"
          }`}
        >
          <Home className="w-4 h-4 xl:w-5 xl:h-5 text-base-content opacity-70 flex-shrink-0" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 text-sm xl:text-base font-medium normal-case ${
            currentPath === "/friends"
              ? "btn-active bg-base-300"
              : "hover:bg-base-300"
          }`}
        >
          <User className="w-4 h-4 xl:w-5 xl:h-5 text-base-content opacity-70 flex-shrink-0" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 text-sm xl:text-base font-medium normal-case ${
            currentPath === "/notifications"
              ? "btn-active bg-base-300"
              : "hover:bg-base-300"
          }`}
        >
          <Bell className="w-4 h-4 xl:w-5 xl:h-5 text-base-content opacity-70 flex-shrink-0" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* ---- PROFILE SECTION ---- */}
      <div className="p-4 xl:p-5 border-t border-base-300 flex-shrink-0">
        <div className="flex items-center gap-3 xl:gap-4">
          <div className="avatar flex-shrink-0">
            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={authUser?.profilePic || "/default-avatar.png"}
                alt="User Avatar"
              />
            </div>
          </div>
          <div className="flex flex-col truncate min-w-0">
            <p className="font-semibold text-xs xl:text-sm truncate">
              {authUser?.fullName || "User"}
            </p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block flex-shrink-0" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
