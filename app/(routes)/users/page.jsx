"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserManagement from "../../../components/UserManagement";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load

    if (!session) {
      router.replace("/login"); // Not logged in → go to login
    } else if (session.user.role !== "admin") {
      router.replace("/dashboard"); // Logged in but not admin → redirect
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || session.user.role !== "admin") {
    return null; // prevent flashing non-admin content
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👤 User Management</h1>
      <UserManagement />
    </div>
  );
}
