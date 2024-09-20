import * as Dialog from "@radix-ui/react-dialog";
import { DateTime } from "luxon";

import { Outlet, useNavigate, useSearchParams } from "@remix-run/react";

export default function ModalRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedWeek = searchParams.get("w") ?? DateTime.local().toISODate();
  return (
    <Dialog.Root
      defaultOpen="true"
      onOpenChange={() => navigate(`/schedule/projects/?w=${selectedWeek}`)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          description="Gökçen's Assignments for VillaSepeti Web"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Dialog.Title className="text-1xl font-bold text-blue-800 mb-4">
            Gökçen's Assignments for VillaSepeti Web
          </Dialog.Title>
          <Outlet />
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
