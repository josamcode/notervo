import { Link } from "react-router-dom";
import { openSearch } from "../utils/catalog";
import { Bell, Search } from "./ui/Icons";

const StickyTopBar = ({ counts }) => {
  const { isLoggedIn, messagesCount } = counts;

  return (
    <div className="pt-safe sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" aria-label="Notervo home" className="-ml-1 p-1">
          <img
            src="/logo-dark.png"
            alt="Notervo"
            width="1080"
            height="300"
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="icon-btn h-10 w-10 rounded-full text-ink active:bg-ink/10"
          >
            <Search className="h-[22px] w-[22px]" />
          </button>
          <Link
            to="/my-messages"
            aria-label={
              isLoggedIn && messagesCount > 0
                ? `Messages, ${messagesCount} unread`
                : "Messages"
            }
            className="icon-btn relative h-10 w-10 rounded-full text-ink active:bg-ink/10"
          >
            <Bell className="h-[22px] w-[22px]" />
            {isLoggedIn && messagesCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-cream">
                {messagesCount > 99 ? "99+" : messagesCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyTopBar;
