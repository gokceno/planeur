import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import DateHeader from "../components/date-header.jsx";

const Team = () => {
  const [expandedTeamMembers, setExpandedTeamMembers] = useState({});
  const toggleTeamMember = (id) => {
    const fetcher = useFetcher();
    useEffect(() => {
      if (fetcher.type === "init") {
        fetcher.load("/schedule/projects/1/team/");
      }
      if (fetcher.type === "done") {
        console.log("Loaded!");
        console.log(fetcher.data);
      }
    }, [fetcher]);
    setExpandedTeamMembers((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="p-4">
      <DateHeader />
      <div className="space-y-2">
        {["Alanna Rowan", "Arun Srinivasan"].map((member, index) => (
          <div key={index}>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleTeamMember(member)}
            >
              <div className="w-1/4 pr-4">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                  <div>
                    <div className="font-semibold">{member}</div>
                    <div className="text-sm text-gray-500">
                      {index === 0 ? "Support, Team Lead" : "Development Lead"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-3/4 grid grid-cols-7 gap-2">
                <div
                  className={`col-span-4 ${
                    index === 0 ? "bg-green-200" : "bg-green-500"
                  } p-2 rounded ${index === 1 ? "text-white" : ""}`}
                >
                  {index === 0 ? "1 open" : "Full"}
                </div>
                <div className="bg-gray-200"></div>
                <div
                  className={`${index === 0 ? "col-span-2" : ""} ${
                    index === 0 ? "bg-green-200" : "bg-green-500"
                  } p-2 rounded ${index === 1 ? "text-white" : ""}`}
                >
                  {index === 0 ? "1 open" : "Full"}
                </div>
                {index === 1 && (
                  <div className="bg-red-500 p-2 rounded text-white">
                    4 over
                  </div>
                )}
              </div>
            </div>
            {expandedTeamMembers[member] && (
              <div className="mt-2 space-y-2">
                {[
                  "Barrington Publishers Spring Issue",
                  index === 0
                    ? "Customer Support Improvement"
                    : "New Feature Development",
                ].map((project, pIndex) => (
                  <div key={pIndex} className="flex items-center">
                    <div className="w-1/4 pr-4 flex items-center">
                      <div className="text-sm ml-6">{project}</div>
                    </div>
                    <div className="w-3/4 grid grid-cols-7 gap-2">
                      <div
                        className={`col-span-${
                          pIndex === 0 ? "4" : "7"
                        } bg-yellow-200 p-1 rounded text-xs`}
                      >
                        {pIndex === 0
                          ? index === 0
                            ? "2 h/d"
                            : "6 h/d"
                          : "4 h/d"}
                      </div>
                      {pIndex === 0 && (
                        <div className="col-span-3 bg-gray-200"></div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center mt-2">
                  <div className="w-1/4 pr-4">
                    <select
                      className="w-3/4 p-2 border rounded text-sm ml-6"
                      onChange={(e) =>
                        addTeamMember("barrington-project", e.target.value)
                      }
                    >
                      <option value="">Add project...</option>
                      <option value="charlie">Charlie Davis</option>
                      <option value="diana">Diana Edwards</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
