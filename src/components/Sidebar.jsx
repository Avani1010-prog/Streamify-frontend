import React from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { Bell, Home, ShipWheel, User } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-72 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 shadow-md">
      {/* ---- LOGO SECTION ---- */}
      <div className="p-6 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3 group">
          <ShipWheel className="w-10 h-10 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            Streamify
          </span>
        </Link>
      </div>

      {/* ---- NAVIGATION ---- */}
      <nav className="flex-1 p-5 space-y-2">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-4 px-4 py-3 text-base font-medium normal-case ${
            currentPath === "/" ? "btn-active bg-base-300" : "hover:bg-base-300"
          }`}
        >
          <Home className="w-5 h-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-4 px-4 py-3 text-base font-medium normal-case ${
            currentPath === "/friends"
              ? "btn-active bg-base-300"
              : "hover:bg-base-300"
          }`}
        >
          <User className="w-5 h-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-4 px-4 py-3 text-base font-medium normal-case ${
            currentPath === "/notifications"
              ? "btn-active bg-base-300"
              : "hover:bg-base-300"
          }`}
        >
          <Bell className="w-5 h-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* ---- PROFILE SECTION ---- */}
      <div className="p-5 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={authUser?.profilePic || "/default-avatar.png"}
                alt="User Avatar"
              />
            </div>
          </div>
          <div className="flex flex-col truncate">
            <p className="font-semibold text-sm truncate">
              {authUser?.fullName || "User"}
            </p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
