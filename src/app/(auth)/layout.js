import React, { Suspense } from "react";

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <div className="flex items-center justify-center h-screen">
        {children}
      </div>
    </Suspense>
  );
}
