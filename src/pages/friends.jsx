import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="h-full bg-base-100 text-base-content transition-colors duration-300 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* ---- FRIENDS SECTION ---- */}
        <div className="shrink-0 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Your Friends
            </h2>
            <Link
              to="/notifications"
              className="btn btn-outline btn-sm md:btn-md whitespace-nowrap"
            >
              <UsersIcon className="mr-2 size-3 md:size-4 shrink-0" />
              <span className="hidden sm:inline">Friend Requests</span>
              <span className="sm:hidden">Requests</span>
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
