import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import "./JournalLayout.css"

export default function JournalLayout() {
  return (
    <>
     <Navigation />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}