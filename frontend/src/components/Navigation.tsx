import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navigation.css"

export default function Navigation() {
  const user = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/journal-rolls">Journal Rolls</Link></li>
        <li><Link to="/journal-rolls/new">Create Roll</Link></li>
        <li><Link to="/journal-rolls/123">Roll Details (dev)</Link></li>
      </ul>
      <nav>{user && <span>{user.userDetails}</span>}</nav>
    </nav>
    
  );
}
