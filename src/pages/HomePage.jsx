import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  sendFriendRequest,
  getRecommendedUsers,
  getOutgoingFriendReqs,
} from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";

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
    <div className="h-full bg-base-100 text-base-content transition-colors duration-300 p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* ---- RECOMMENDED USERS ---- */}
        <section className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="w-full sm:w-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="text-sm sm:text-base opacity-70 mt-1 max-w-2xl">
                  Discover perfect language exchange partners based on your
                  profile.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 text-base-content p-4 md:p-6 text-center shadow-md">
              <h3 className="font-semibold text-base md:text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-sm md:text-base opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6 w-full overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:bg-base-300 transition-all duration-300 shadow-lg border border-base-300 w-full h-full flex flex-col"
                  >
                    <div className="card-body p-4 md:p-5 space-y-3 md:space-y-4 flex flex-col flex-1">
                      {/* USER INFO */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="avatar shrink-0">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                              src={
                                user.profilePic ||
                                "https://via.placeholder.com/150?text=User"
                              }
                              alt={user.fullName}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base md:text-lg truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1 min-w-0">
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary flex items-center text-xs whitespace-nowrap">
                          {getLanguageFlag(user.nativeLanguage)}
                          <span className="hidden sm:inline">Native: </span>
                          <span className="truncate max-w-[100px] sm:max-w-none">
                            {capitalize(user.nativeLanguage)}
                          </span>
                        </span>
                        <span className="badge badge-outline flex items-center text-xs whitespace-nowrap">
                          {getLanguageFlag(user.learningLanguage)}
                          <span className="hidden sm:inline">Learning: </span>
                          <span className="truncate max-w-[100px] sm:max-w-none">
                            {capitalize(user.learningLanguage)}
                          </span>
                        </span>
                      </div>

                      {/* BIO */}
                      {user.bio && (
                        <p className="text-xs md:text-sm opacity-80 line-clamp-2 break-words">
                          {user.bio}
                        </p>
                      )}

                      {/* ACTION BUTTON */}
                      <button
                        className={`btn w-full mt-auto btn-sm md:btn-md whitespace-nowrap ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-3 md:size-4 mr-2 shrink-0" />
                            <span className="hidden sm:inline">
                              Request Sent
                            </span>
                            <span className="sm:hidden">Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-3 md:size-4 mr-2 shrink-0" />
                            <span className="hidden sm:inline">
                              Send Friend Request
                            </span>
                            <span className="sm:hidden">Send Request</span>
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
