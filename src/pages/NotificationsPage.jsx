import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  UserCheckIcon,
  ClockIcon,
  MessageSquareIcon,
} from "lucide-react";
import { getFriendRequests, acceptFriendRequest } from "../lib/api";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
      <div className="container mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl space-y-6 md:space-y-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-3 md:p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="avatar w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300 flex-shrink-0">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm md:text-base truncate">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm text-xs">
                                  <span className="hidden sm:inline">Native: </span>
                                  {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm text-xs">
                                  <span className="hidden sm:inline">Learning: </span>
                                  {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm md:btn-md flex-shrink-0 w-full sm:w-auto"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/*ACCEPTED REQS NOTIFICATIONS */}

            {acceptedRequests.length > 0 && (
              <section className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-4 w-4 md:h-5 md:w-5 text-success flex-shrink-0" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-3 md:p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-9 md:size-10 rounded-full flex-shrink-0">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base truncate">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-xs md:text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success flex-shrink-0">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">New Friend</span>
                            <span className="sm:hidden">New</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
