import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Eye,
  XCircle,
  Users,
  Search,
  CheckCircle2,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  //  FETCH BOOKINGS 

  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data.bookings || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  //  CANCEL BOOKING 

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancellingId(bookingId);
      setError("");

      await api.post(
        `/bookings/cancel/${bookingId}`
      );

      await getBookings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to cancel booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  //  HELPERS 

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getBookingId = (id) => {
    if (!id) return "N/A";

    return id.slice(-8).toUpperCase();
  };

  //  STATS 

  const confirmedCount = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.status === "confirmed"
      ).length,
    [bookings]
  );

  const cancelledCount = useMemo(
    () =>
      bookings.filter(
        (booking) => booking.status === "cancelled"
      ).length,
    [bookings]
  );

  const totalSpent = useMemo(
    () =>
      bookings
        .filter(
          (booking) =>
            booking.status === "confirmed"
        )
        .reduce(
          (total, booking) =>
            total + Number(booking.totalAmount || 0),
          0
        ),
    [bookings]
  );

  //  FILTER 

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesFilter =
        filter === "all" ||
        booking.status === filter;

      if (!query) {
        return matchesFilter;
      }

      const trip = booking.tripId;
      const bus = trip?.busId;

      const bookingId =
        booking._id?.toLowerCase() || "";

      const operator =
        bus?.operator?.toLowerCase() || "";

      const busNumber =
        bus?.busNumber?.toLowerCase() || "";

      const source =
        bus?.source?.toLowerCase() || "";

      const destination =
        bus?.destination?.toLowerCase() || "";

      const passengerNames =
        booking.passengers
          ?.map((passenger) =>
            passenger.name?.toLowerCase()
          )
          .join(" ") || "";

      const matchesSearch =
        bookingId.includes(query) ||
        operator.includes(query) ||
        busNumber.includes(query) ||
        source.includes(query) ||
        destination.includes(query) ||
        passengerNames.includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 font-medium mt-5">
            Loading your bookings...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">



        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
                <Ticket size={15} />
                Your Trips
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                My Bookings
              </h1>

              <p className="text-gray-500 mt-2">
                View and manage your bus bookings.
              </p>

            </div>

            <button
              onClick={() => navigate("/")}
              className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              <Bus size={18} />
              Book a Ticket
            </button>

          </div>

        </div>



        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">

            <XCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>

          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<Ticket size={21} />}
            className="bg-indigo-100 text-indigo-600"
          />

          <StatCard
            title="Confirmed"
            value={confirmedCount}
            icon={<CheckCircle2 size={21} />}
            className="bg-green-100 text-green-600"
          />

          <StatCard
            title="Total Spent"
            value={`₹${totalSpent}`}
            icon={<IndianRupee size={21} />}
            className="bg-purple-100 text-purple-600"
          />

        </div>

        {/* ================= SEARCH + FILTER ================= */}

        {bookings.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">

              <div className="relative">

                <Search
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search by booking ID, passenger, bus or route..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

              </div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white md:w-48"
              >
                <option value="all">
                  All Bookings
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            <div className="flex items-center justify-between mt-4 text-sm">

              <p className="text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredBookings.length}
                </span>{" "}
                booking
                {filteredBookings.length !== 1
                  ? "s"
                  : ""}
              </p>

              {cancelledCount > 0 && (
                <p className="text-gray-400">
                  {cancelledCount} cancelled
                </p>
              )}

            </div>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {bookings.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">

              <Search
                size={28}
                className="text-gray-400"
              />

            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              No bookings found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-5 text-indigo-600 font-semibold hover:underline"
            >
              Clear filters
            </button>

          </div>
        ) : (
          /* ================= BOOKING LIST ================= */

          <div className="space-y-5">

            {filteredBookings.map((booking) => {

              const trip = booking.tripId;
              const bus = trip?.busId;

              const isCancelled =
                booking.status === "cancelled";

              const passengerCount =
                booking.passengers?.length ||
                booking.seats?.length ||
                0;

              const isCancelling =
                cancellingId === booking._id;

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md ${isCancelled
                    ? "opacity-80"
                    : ""
                    }`}
                >

                  {/* ================= CARD HEADER ================= */}

                  <div
                    className={`px-5 sm:px-6 py-4 border-b ${isCancelled
                      ? "bg-red-50/50"
                      : "bg-white"
                      }`}
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${isCancelled
                            ? "bg-red-100"
                            : "bg-indigo-100"
                            }`}
                        >

                          <Bus
                            size={22}
                            className={
                              isCancelled
                                ? "text-red-500"
                                : "text-indigo-600"
                            }
                          />

                        </div>

                        <div>

                          <h2 className="font-bold text-lg text-gray-900">
                            {bus?.operator ||
                              "Bus"}
                          </h2>

                          <p className="text-sm text-gray-500">
                            {bus?.busNumber ||
                              "N/A"}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${isCancelled
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                            }`}
                        >
                          {booking.status}
                        </span>

                        <div className="text-right">

                          <p className="text-xs text-gray-500">
                            Booking ID
                          </p>

                          <p className="font-bold text-gray-800">
                            #{getBookingId(
                              booking._id
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ================= JOURNEY ================= */}

                  <div className="p-5 sm:p-6">

                    <div className="bg-slate-50 rounded-2xl p-5">

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-5">

                        {/* SOURCE */}

                        <div>

                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            From
                          </p>

                          <div className="flex items-center gap-2 mt-1">

                            <MapPin
                              size={18}
                              className="text-indigo-600"
                            />

                            <p className="text-lg font-bold text-gray-900">
                              {bus?.source ||
                                "N/A"}
                            </p>

                          </div>

                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {trip?.departureTime ||
                              "--:--"}
                          </p>

                        </div>

                        {/* ROUTE */}

                        <div className="hidden md:flex flex-col items-center">

                          <p className="text-xs text-gray-400 mb-2">
                            Journey
                          </p>

                          <div className="flex items-center gap-2">

                            <div className="w-10 h-px bg-gray-300" />

                            <div className="w-9 h-9 rounded-full bg-white border border-indigo-100 flex items-center justify-center">
                              <ArrowRight
                                size={17}
                                className="text-indigo-600"
                              />
                            </div>

                            <div className="w-10 h-px bg-gray-300" />

                          </div>

                        </div>

                        {/* DESTINATION */}

                        <div className="md:text-right">

                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            To
                          </p>

                          <div className="flex md:justify-end items-center gap-2 mt-1">

                            <p className="text-lg font-bold text-gray-900">
                              {bus?.destination ||
                                "N/A"}
                            </p>

                            <MapPin
                              size={18}
                              className="text-indigo-600"
                            />

                          </div>

                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {trip?.arrivalTime ||
                              "--:--"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* JOURNEY INFO  */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

                      <InfoItem
                        icon={
                          <CalendarDays
                            size={19}
                          />
                        }
                        label="Travel Date"
                        value={formatDate(
                          trip?.travelDate
                        )}
                      />

                      <InfoItem
                        icon={
                          <Ticket size={19} />
                        }
                        label="Seats"
                        value={
                          booking.seats?.join(
                            ", "
                          ) || "N/A"
                        }
                      />

                      <InfoItem
                        icon={
                          <Users size={19} />
                        }
                        label="Passengers"
                        value={`${passengerCount} ${passengerCount === 1
                          ? "Passenger"
                          : "Passengers"
                          }`}
                      />

                    </div>

                    {/*  PASSENGERS  */}

                    {booking.passengers?.length >
                      0 && (
                        <div className="border-t border-gray-100 mt-6 pt-6">

                          <div className="flex items-center justify-between mb-4">

                            <div>

                              <h3 className="font-bold text-gray-900">
                                Passenger Details
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Passengers assigned to
                                your selected seats
                              </p>

                            </div>

                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                            {booking.passengers.map(
                              (
                                passenger,
                                index
                              ) => (
                                <div
                                  key={`${passenger.seat}-${index}`}
                                  className="bg-slate-50 border border-gray-100 rounded-xl p-4"
                                >

                                  <div className="flex items-start justify-between gap-3">

                                    <div>

                                      <p className="font-semibold text-gray-900">
                                        {
                                          passenger.name
                                        }
                                      </p>

                                      <p className="text-sm text-gray-500 mt-1">
                                        Age{" "}
                                        {
                                          passenger.age
                                        }{" "}
                                        •{" "}
                                        <span className="capitalize">
                                          {
                                            passenger.gender
                                          }
                                        </span>
                                      </p>

                                    </div>

                                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                      {
                                        passenger.seat
                                      }
                                    </span>

                                  </div>

                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}



                    <div className="border-t border-gray-100 mt-6 pt-5">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        <div>

                          <p className="text-sm text-gray-500">
                            Total Amount
                          </p>

                          <p
                            className={`text-2xl font-bold mt-1 ${isCancelled
                              ? "text-gray-500"
                              : "text-indigo-600"
                              }`}
                          >
                            ₹
                            {
                              booking.totalAmount
                            }
                          </p>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">

                          <button
                            onClick={() =>
                              navigate(
                                `/booking/${booking._id}`
                              )
                            }
                            className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition"
                          >
                            <Eye size={17} />
                            View Ticket
                          </button>

                          {!isCancelled && (
                            <button
                              onClick={() =>
                                handleCancel(
                                  booking._id
                                )
                              }
                              disabled={
                                isCancelling
                              }
                              className="flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl font-semibold transition"
                            >
                              {isCancelling ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <XCircle
                                    size={17}
                                  />
                                  Cancel Booking
                                </>
                              )}
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  className,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>

        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/*  INFO ITEM  */

const InfoItem = ({
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

        <p className="font-semibold text-gray-900 mt-0.5 truncate">
          {value}
        </p>

      </div>

    </div>
  );
};

/* ================= EMPTY STATE ================= */

const EmptyState = ({ navigate }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 sm:p-14 text-center">

      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">

        <Ticket
          size={30}
          className="text-indigo-500"
        />

      </div>

      <h2 className="text-xl font-semibold text-gray-800 mt-5">
        No bookings yet
      </h2>

      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        You haven't booked any bus tickets yet.
        Find a bus and book your first journey.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        Find a Bus
      </button>

    </div>
  );
};

export default MyBookings;