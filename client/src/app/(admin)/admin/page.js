import { Suspense } from "react";
import AdminPage from "@/components/pages/AdminPage";
import Spinner from "@/components/common/Spinner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner label="Loading..." />
        </div>
      }
    >
      <AdminPage />
    </Suspense>
  );
}
