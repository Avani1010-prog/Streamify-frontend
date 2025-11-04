import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  sendFriendRequest,
  getRecommendedUsers,
  getUserFriends,
  getOutgoingFriendReqs,
} from "../lib/api";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

// ✅ Language → Flag mapping
const LANGUAGE_FLAGS = {
  english: "gb",
  spanish: "es",
  french: "fr",
  german: "de",
  hindi: "in",
  japanese: "jp",
  chinese: "cn",
  korean: "kr",
  italian: "it",
  arabic: "sa",
  portuguese: "pt",
  russian: "ru",
};

// ✅ Helper for flag rendering
const getLanguageFlag = (language) => {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const code = LANGUAGE_FLAGS[langLower];
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      alt={`${language} flag`}
      className="h-3 mr-1 inline-block"
    />
  );
};

// ✅ Capitalize helper
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const Homepage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendsReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendsReqs?.length > 0) {
      outgoingFriendsReqs.forEach((req) => {
        if (req.recipient?._id) outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendsReqs]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 p-4 sm:p-6 lg:px-32">
      <div className="max-w-7xl mx-auto space-y-10 w-full">
        {/* ---- FRIENDS SECTION ---- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* ---- RECOMMENDED USERS ---- */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 text-base-content p-6 text-center shadow-md">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:bg-base-300 transition-all duration-300 shadow-lg border border-base-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      {/* USER INFO */}
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                              src={
                                user.profilePic ||
                                "https://via.placeholder.com/150?text=User"
                              }
                              alt={user.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary flex items-center">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline flex items-center">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* BIO */}
                      {user.bio && (
                        <p className="text-sm opacity-80">{user.bio}</p>
                      )}

                      {/* ACTION BUTTON */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Homepage;
