import { Outlet, Link } from "@remix-run/react";

const Schedule = () => {
  return (
    <div className="bg-white rounded shadow">
      <div className="flex justify-between p-4 border-b">
        <div className="flex space-x-2">
          <Link
            className={`px-4 py-2 rounded bg-white border`}
            to="/schedule/projects/"
          >
            Projects
          </Link>
          <Link
            className={`px-4 py-2 rounded bg-gray-200`}
            to="/schedule/team"
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
          <button className="p-2 bg-white border rounded">
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
          <button className="px-4 py-2 bg-white border rounded">
            This Week
          </button>
          <button className="p-2 bg-white border rounded">
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
}

export default Schedule;
