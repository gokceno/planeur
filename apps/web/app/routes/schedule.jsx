import { Outlet, Link, useSearchParams, useMatches } from "@remix-run/react";
import { DateTime } from "luxon";

const Schedule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gotoWeek = (direction) => {
    const currentWeek = DateTime.local().startOf("week");
    const activeMonday =
      searchParams.get("w") != null
        ? DateTime.fromISO(searchParams.get("w"))
        : currentWeek;
    const params = new URLSearchParams();
    const weekOffset = {
      previous: -1,
      next: 1,
      current: 0,
    };
    const targetDate =
      direction === "current"
        ? currentWeek
        : activeMonday.plus({ weeks: weekOffset[direction] });
    params.set("w", targetDate.toISODate());
    setSearchParams(params);
  };
  return (
    <div className="bg-white rounded shadow">
      <div className="flex justify-between p-4 border-b">
        <div className="flex space-x-2">
          <Link
            className={`px-4 py-2 rounded ${
              useMatches().some(
                (match) => match.pathname === "/schedule/projects/"
              )
                ? "bg-gray-200"
                : "bg-white border"
            }`}
            to="/schedule/projects/"
          >
            Projects
          </Link>
          <Link
            className={`px-4 py-2 rounded ${
              useMatches().some((match) => match.pathname === "/schedule/team/")
                ? "bg-gray-200"
                : "bg-white border"
            }`}
            to="/schedule/team/"
          >
            Team
          </Link>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex space-x-2 mr-4 text-sm">
            <button
              className={`text-blue-600 hover:text-blue-800`}
              onClick={() => setActiveView("weekly")}
            >
              Weekly
            </button>
            <span className="text-gray-300">|</span>
            <button
              className={`text-blue-600 hover:text-blue-800`}
              onClick={() => setActiveView("monthly")}
            >
              Monthly
            </button>
            <span className="text-gray-300">|</span>
            <button
              className={`text-blue-600 hover:text-blue-800`}
              onClick={() => setActiveView("quarterly")}
            >
              Quarterly
            </button>
          </div>
          <button
            onClick={() => {
              gotoWeek("previous");
            }}
            className="p-2 bg-white border rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => {
              gotoWeek("current");
            }}
            className="px-4 py-2 bg-white border rounded"
          >
            This Week
          </button>
          <button
            onClick={() => {
              gotoWeek("next");
            }}
            className="p-2 bg-white border rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Schedule;
