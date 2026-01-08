import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function JournalLayout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}