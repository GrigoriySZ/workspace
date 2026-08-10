import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvide } from "./context/UserProvidet";

import { Sidebar } from "./components/Layout/Sidebar";
import { Booking } from "./pages/Booking";
import { Profile } from "./pages/Profile";
import { Dashboard } from "./pages/Dashboard";
import { ResourceDetail } from "./pages/ResourceDetail";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {

  return (
    <ErrorBoundary>
      <UserProvide>
        <Router>
          <div className="gtid grid-col-[260px_1fr] gap-4">
            <Sidebar />
            <main className="ml-65 p-8 bg-gray-50 h-screen min-w-fit">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/resource/:id" element={<ResourceDetail />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UserProvide>
    </ErrorBoundary>
  );
};