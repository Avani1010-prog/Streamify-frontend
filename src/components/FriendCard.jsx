import React from "react";
import { Link } from "react-router-dom";

const LANGUAGE_TO_FLAG = {
  english: "gb",
  spanish: "es",
  french: "fr",
  german: "de",
  hindi: "in",
  japanese: "jp",
  chinese: "cn",
};

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full">
      <div className="card-body p-3 md:p-4 flex flex-col">
        {/*USER INFO*/}
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="avatar size-10 md:size-12 flex-shrink-0">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold text-sm md:text-base truncate flex-1 min-w-0">
            {friend.fullName}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2 md:mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="hidden sm:inline">Native: </span>
            {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="hidden sm:inline">Learning: </span>
            {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full btn-sm md:btn-md mt-auto">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower]; // ✅ FIXED

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }

  return null;
}
