import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bus,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Users,
  IndianRupee,
} from "lucide-react";
import api from "../services/api";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/bookings/${bookingId}`
        );

        setBooking(response.data.booking);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load booking"
        );
      } finally {
        setLoading(false);
      }
    };

    getBooking();
  }, [bookingId]);



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 font-medium mt-5">
            Loading your ticket...
          </p>

        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">

          <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <XCircle size={28} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Unable to load booking
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/bookings")}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Back to My Bookings
          </button>

        </div>

      </div>
    );
  }



  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="text-center">

          <h2 className="text-xl font-bold text-gray-900">
            Booking not found
          </h2>

          <button
            onClick={() => navigate("/bookings")}
            className="mt-5 text-indigo-600 font-semibold hover:underline"
          >
            Go to My Bookings
          </button>

        </div>

      </div>
    );
  }

  const trip = booking.tripId;
  const bus = trip?.busId;

  const isCancelled =
    booking.status === "cancelled";

  const formattedDate = trip?.travelDate
    ? new Date(trip.travelDate).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
    : "N/A";

  const formattedBookingId = booking._id
    ? booking._id.slice(-8).toUpperCase()
    : "N/A";

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">

      <div className="max-w-4xl mx-auto px-4 sm:px-6">


        <div className="text-center mb-8">

          <div
            className={`inline-flex items-center justify-center rounded-full p-4 mb-4 ${isCancelled
              ? "bg-red-100"
              : "bg-green-100"
              }`}
          >
            {isCancelled ? (
              <XCircle
                size={42}
                className="text-red-500"
              />
            ) : (
              <CheckCircle2
                size={42}
                className="text-green-600"
              />
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {isCancelled
              ? "Booking Cancelled"
              : "Booking Confirmed!"}
          </h1>

          <p className="text-gray-500 mt-2">
            {isCancelled
              ? "This booking has been cancelled."
              : "Your bus ticket has been booked successfully."}
          </p>

        </div>

        ]]

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">


          <div
            className={`text-white p-6 sm:p-7 ${isCancelled
              ? "bg-gray-600"
              : "bg-gradient-to-r from-indigo-600 to-purple-600"
              }`}
          >

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="bg-white/15 p-3 rounded-xl">
                  <Bus size={28} />
                </div>

                <div>

                  <p className="text-white/70 text-sm">
                    Bus Operator
                  </p>

                  <h2 className="text-xl font-bold">
                    {bus?.operator || "Bus"}
                  </h2>

                  <p className="text-white/70 mt-0.5">
                    {bus?.busNumber || "N/A"}
                  </p>

                </div>

              </div>

              <div className="sm:text-right">

                <p className="text-white/70 text-xs uppercase tracking-wide">
                  Booking ID
                </p>

                <p className="font-bold text-lg mt-1">
                  #{formattedBookingId}
                </p>

              </div>

            </div>

          </div>

          {/*  ROUTE  */}

          <div className="p-6 sm:p-8 border-b">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">

              {/* DEPARTURE */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Departure
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {trip?.departureTime || "--:--"}
                </p>

                <div className="flex items-center gap-2 mt-2 text-gray-500">

                  <MapPin
                    size={17}
                    className="text-indigo-600"
                  />

                  <span className="font-medium">
                    {bus?.source || "N/A"}
                  </span>

                </div>

              </div>

              {/* JOURNEY */}

              <div className="flex items-center justify-center">

                <div className="hidden md:block w-16 h-px bg-gray-300" />

                <div className="mx-3 w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                  <ArrowRight
                    size={19}
                    className="text-indigo-600"
                  />
                </div>

                <div className="hidden md:block w-16 h-px bg-gray-300" />

              </div>

              {/* ARRIVAL */}

              <div className="md:text-right">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Arrival
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {trip?.arrivalTime || "--:--"}
                </p>

                <div className="flex md:justify-end items-center gap-2 mt-2 text-gray-500">

                  <span className="font-medium">
                    {bus?.destination || "N/A"}
                  </span>

                  <MapPin
                    size={17}
                    className="text-indigo-600"
                  />

                </div>

              </div>

            </div>

          </div>

          {/*  JOURNEY DETAILS  */}

          <div className="p-6 sm:p-7 border-b">

            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Journey Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <InfoCard
                icon={<CalendarDays size={20} />}
                label="Travel Date"
                value={formattedDate}
              />

              <InfoCard
                icon={<Ticket size={20} />}
                label="Seats"
                value={
                  booking.seats?.join(", ") ||
                  "N/A"
                }
              />

              <InfoCard
                icon={<Bus size={20} />}
                label="Bus Number"
                value={
                  bus?.busNumber || "N/A"
                }
              />

            </div>

          </div>

          {/*  PASSENGERS  */}

          <div className="p-6 sm:p-7 border-b">

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Passenger Details
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {booking.passengers?.length || 0}{" "}
                  passenger
                  {booking.passengers?.length !== 1
                    ? "s"
                    : ""}{" "}
                  on this booking
                </p>

              </div>

              <div className="hidden sm:flex w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl items-center justify-center">
                <Users size={20} />
              </div>

            </div>

            <div className="space-y-3">

              {booking.passengers?.map(
                (passenger, index) => (
                  <div
                    key={`${passenger.seat}-${index}`}
                    className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                          <User
                            size={21}
                            className="text-indigo-600"
                          />
                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {passenger.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1 capitalize">
                            Age {passenger.age} •{" "}
                            {passenger.gender}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <span className="text-xs text-gray-500">
                          Seat
                        </span>

                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                          {passenger.seat}
                        </span>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>


          <div className="p-6 sm:p-7">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>

                <p className="text-sm text-gray-500">
                  Booking Status
                </p>

                <div className="flex items-center gap-2 mt-2">

                  {isCancelled ? (
                    <XCircle
                      size={18}
                      className="text-red-500"
                    />
                  ) : (
                    <CheckCircle2
                      size={18}
                      className="text-green-600"
                    />
                  )}

                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${isCancelled
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {booking.status}
                  </span>

                </div>

              </div>

              <div className="sm:text-right">

                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

                <div className="flex items-center sm:justify-end gap-1 mt-1">

                  <IndianRupee
                    size={23}
                    className={
                      isCancelled
                        ? "text-gray-500"
                        : "text-indigo-600"
                    }
                  />

                  <p
                    className={`text-3xl font-bold ${isCancelled
                      ? "text-gray-500"
                      : "text-indigo-600"
                      }`}
                  >
                    {booking.totalAmount}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/*  ACTIONS  */}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <button
            onClick={() =>
              navigate("/bookings")
            }
            className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <Ticket size={18} />
            My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <Bus size={18} />
            Book Another Ticket
          </button>

        </div>

      </div>

    </div>
  );
};

/*  INFO CARD  */

const InfoCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">

      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="font-semibold text-gray-900 mt-1 truncate">
          {value}
        </p>

      </div>

    </div>
  );
};

export default BookingDetails;