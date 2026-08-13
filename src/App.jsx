import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SeatSelection from "./pages/SeatSelection.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import PassengerDetails from "./pages/PassengerDetails.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/trip/:tripId" element={<SeatSelection />} />
        <Route
          path="/passenger/:tripId"
          element={<PassengerDetails />}
        />
        <Route
          path="/booking/:bookingId"
          element={<BookingDetails />}
        />
        <Route
          path="/bookings"
          element={<MyBookings />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;