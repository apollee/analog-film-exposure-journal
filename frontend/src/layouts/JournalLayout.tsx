import { Outlet } from "react-router-dom";

export default function JournalLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}