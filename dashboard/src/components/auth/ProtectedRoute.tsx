import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: any }) => {
  const at = localStorage.getItem("at")
  let location = useLocation()

  // dont route is path is signup or login
  if (
    !at &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup"
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default ProtectedRoute
