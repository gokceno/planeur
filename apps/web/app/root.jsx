import {
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "./tailwind.css?url";

export const meta = () => [
  { charset: "utf-8" },
  { title: "Planeur - Resource Planner" },
  { viewport: "width=device-width,initial-scale=1" },
];

export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center mb-4 bg-blue-800 p-2 rounded shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Planeur</h1>
          <Link to="/schedule/" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600">
            Schedule
          </Link>
          <Link to="/manage/" className="px-4 py-2 text-white hover:bg-blue-700">
            Manage
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/settings" className="p-2 bg-blue-700 rounded-full hover:bg-blue-600">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
