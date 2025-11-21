import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      // Check if user manually logged out
      const isLoggedOut = localStorage.getItem("isLoggedOut");
      if (isLoggedOut === "true") {
        return null;
      }
      return await getAuthUser();
    },
    retry: false, // auth check
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
