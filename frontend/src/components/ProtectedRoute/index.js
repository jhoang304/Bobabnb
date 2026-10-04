import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

// A Route that only renders for a logged-in user. Anyone else, including someone who logs out
// while on the page, is sent to the homepage.
export default function ProtectedRoute({ children, ...routeProps }) {
  const sessionUser = useSelector((state) => state.session.user);
  return <Route {...routeProps}>{sessionUser ? children : <Redirect to="/" />}</Route>;
}
