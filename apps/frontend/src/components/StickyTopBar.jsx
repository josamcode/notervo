import { Link } from "react-router-dom";
import useNavCounts from "../hooks/useNavCounts";

const BellIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const StickyTopBar = () => {
  const { isLoggedIn, messagesCount } = useNavCounts();

  return (
    <div className="sticky mt-[-70px] top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <div className="px-4 pt-3 pb-0 border-b-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <img src="/logo-dark.png" alt="Notervo" className="h-7 w-auto" />
          </div>
          <Link to="/my-messages" className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center active:bg-gray-100 transition-colors">
            <BellIcon className="w-5 h-5 text-gray-600" />
            {isLoggedIn && messagesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
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
