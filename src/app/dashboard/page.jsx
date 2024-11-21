"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../../utils/auth";

export default function DashboardPage() {
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    // Ensure localStorage is available
    if (typeof localStorage !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log("userData", userData);
      setUser(userData);
    }

    let inactivityTimeout;

    const resetInactivityTimeout = () => {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minute
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];

    if (typeof window !== "undefined") {
      events.forEach((event) => {
        window.addEventListener(event, resetInactivityTimeout);
      });

      resetInactivityTimeout();
    }

    return () => {
      clearTimeout(inactivityTimeout);
      if (typeof window !== "undefined") {
        events.forEach((event) => {
          window.removeEventListener(event, resetInactivityTimeout);
        });
      }
    };
  }, []);

  const handleLogout = () => {
    console.log("log out===>");
    removeToken();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Welcome, {user?.first_name} {user?.last_name}!
          </h2>
          <p className="text-gray-600">
            Email:{" "}
            <span className="font-medium text-gray-800">{user?.email}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Status:{" "}
            <span
              className={`${
                user?.status === 1 ? "text-green-600" : "text-red-600"
              } font-medium`}
            >
              {user?.status === 1 ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </main>

      <footer className="w-full bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center text-sm">
          © {new Date().getFullYear()} Your Company. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
