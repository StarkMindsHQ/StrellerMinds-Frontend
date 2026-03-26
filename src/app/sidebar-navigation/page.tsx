"use client";

import Sidebar from "./Sidebar";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  {
    label: "Courses",
    path: "/courses",
    children: [
      { label: "All Courses", path: "/courses/all" },
      { label: "My Courses", path: "/courses/mine" },
    ],
  },
  { label: "Settings", path: "/settings" },
];

export default function Page() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar items={navItems} />
      <main style={{ flex: 1, padding: "24px" }}>
        <h1>Sidebar Navigation Demo</h1>
        <p>Click items to navigate. Collapse/expand using the button.</p>
      </main>
    </div>
  );
}