import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound({ message = "We couldn't find the page you're looking for." }) {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>{message}</p>
      <Link to="/" className="not-found-home">Back to all spots</Link>
    </div>
  );
}
