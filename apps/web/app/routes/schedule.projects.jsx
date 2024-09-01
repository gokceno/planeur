import { useState } from "react";
import DateHeaders from "../components/date-header.jsx";

const Projects = () => {
  const [expandedProjects, setExpandedProjects] = useState({});
  const toggleProject = (id) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="p-4">
      <DateHeaders />
      <div className="space-y-2">
        <div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleProject("barrington-project")}
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
                <div className="font-semibold">
                  Barrington Publishers Spring Issue
                </div>
              </div>
            </div>
            <div className="w-3/4 grid grid-cols-7 gap-2">
              <div className="col-span-7 bg-yellow-200 p-2 rounded">
                4 h/d 60h
              </div>
            </div>
          </div>
          {expandedProjects["barrington-project"] && (
            <div className="mt-2 space-y-2">
              {["Alice Johnson", "Bob Wilson"].map((member, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/4 pr-4">
                    <div className="flex items-center ml-6">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                      <div className="text-sm">{member}</div>
                    </div>
                  </div>
                  <div className="w-3/4 grid grid-cols-7 gap-2">
                    <div
                      className={`col-span-${index === 0 ? "7" : "3"} bg-blue-300 p-1 rounded text-xs`}
                    >
                      2 h/d
                    </div>
                    {index !== 0 && (
                      <>
                        <div className="col-span-3 bg-gray-200"></div>
                        <div className="bg-gray-200"></div>
                      </>
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
                    <option value="">Add team member...</option>
                    <option value="charlie">Charlie Davis</option>
                    <option value="diana">Diana Edwards</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;