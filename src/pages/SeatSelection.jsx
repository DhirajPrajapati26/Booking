import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  Check,
  Armchair,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import api from "../services/api";

const SeatSelection = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTrip = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/trips/${tripId}`);

        setTrip(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load trip"
        );
      } finally {
        setLoading(false);
      }
    };

    getTrip();
  }, [tripId]);

  const handleSeatClick = (seat) => {
    if (seat.status !== "available") {
      return;
    }

    setError("");

    setSelectedSeats((prev) => {
      if (prev.includes(seat.number)) {
        return prev.filter(
          (number) => number !== seat.number
        );
      }

      return [...prev, seat.number];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    navigate(`/passenger/${tripId}`, {
      state: {
        selectedSeats,
        price: trip.busId.price,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 font-medium mt-5">
            Loading seats...
          </p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bus size={25} className="text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load trip
          </h2>

          <p className="text-red-500 text-sm">
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Trip not found</p>
      </div>
    );
  }

  const availableSeats = trip.seats.filter(
    (seat) => seat.status === "available"
  ).length;

  const bookedSeats = trip.seats.length - availableSeats;

  const totalAmount =
    selectedSeats.length * trip.busId.price;

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">



        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to buses
        </button>



        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* Bus */}

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Bus
                  size={27}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {trip.busId.operator}
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                  {trip.busId.busNumber}
                </p>
              </div>

            </div>

            {/* Availability */}

            <div className="flex items-center gap-4">

              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <Users size={17} />
                {trip.seats.length} seats
              </div>

              <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Armchair size={18} />

                <span className="font-semibold text-sm">
                  {availableSeats} available
                </span>
              </div>

            </div>

          </div>



          <div className="border-t border-gray-100 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">

            {/* Route */}

            <div className="flex items-center gap-3">
              <MapPin
                size={19}
                className="text-indigo-600"
              />

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Route
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {trip.busId.source} →{" "}
                  {trip.busId.destination}
                </p>
              </div>
            </div>

            {/* Journey */}

            <div className="flex items-center gap-3">
              <Clock
                size={19}
                className="text-indigo-600"
              />

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Journey
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {trip.departureTime} →{" "}
                  {trip.arrivalTime}
                </p>
              </div>
            </div>

            {/* Price */}

            <div className="flex items-center gap-3">
              <Armchair
                size={19}
                className="text-indigo-600"
              />

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Price / Seat
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  ₹{trip.busId.price}
                </p>
              </div>
            </div>

          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Seat Layout */}

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 md:p-8">



            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Select Your Seats
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Choose one or more available seats
                </p>
              </div>



              <div className="flex flex-wrap gap-4 text-xs sm:text-sm">

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white border border-gray-300" />
                  Available
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-indigo-600" />
                  Selected
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-400" />
                  Booked
                </div>

              </div>

            </div>

            {/* Bus */}

            <div className="max-w-md mx-auto">

              <div className="border-2 border-gray-200 rounded-[2rem] bg-slate-50 p-4 sm:p-7">



                <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-7 flex items-center justify-between shadow-sm">

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Driver
                    </p>

                    <p className="font-semibold text-gray-700 mt-1">
                      Front
                    </p>
                  </div>

                  <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bus
                      size={22}
                      className="text-gray-500"
                    />
                  </div>

                </div>


                <div className="text-center mb-5">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    Seat Layout
                  </span>
                </div>

                {/* Seats */}

                <div className="grid grid-cols-2 gap-3 sm:gap-4">

                  {trip.seats.map((seat) => {

                    const isSelected =
                      selectedSeats.includes(
                        seat.number
                      );

                    const isBooked =
                      seat.status === "booked";

                    return (
                      <button
                        key={seat.number}
                        disabled={isBooked}
                        onClick={() =>
                          handleSeatClick(seat)
                        }
                        aria-label={`Seat ${seat.number}${isBooked
                          ? " booked"
                          : isSelected
                            ? " selected"
                            : " available"
                          }`}
                        className={`
                          h-14 rounded-xl font-semibold
                          flex items-center justify-center
                          gap-2 transition-all duration-200
                          border
                          ${isBooked
                            ? "bg-gray-400 border-gray-400 text-white cursor-not-allowed"
                            : isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]"
                              : "bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:-translate-y-0.5"
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check size={17} />
                        ) : (
                          <Armchair size={17} />
                        )}

                        {seat.number}
                      </button>
                    );
                  })}

                </div>



                <div className="text-center mt-7 pt-5 border-t border-dashed border-gray-300">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Rear of Bus
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Summary */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 h-fit lg:sticky lg:top-24">



            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Armchair
                  size={20}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Booking Summary
                </h2>

                <p className="text-xs text-gray-500">
                  Review your selection
                </p>
              </div>

            </div>

            {/* Price */}

            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Price / Seat
                </span>

                <span className="font-semibold">
                  ₹{trip.busId.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Selected Seats
                </span>

                <span className="font-semibold">
                  {selectedSeats.length}
                </span>
              </div>

              {/* Seats */}

              <div className="border-t pt-5">

                <p className="text-sm text-gray-500 mb-3">
                  Your seats
                </p>

                {selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {selectedSeats.map((seat) => (
                      <button
                        key={seat}
                        onClick={() => {
                          setSelectedSeats((prev) =>
                            prev.filter(
                              (item) => item !== seat
                            )
                          );
                        }}
                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                        title="Remove seat"
                      >
                        {seat}
                      </button>
                    ))}

                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No seats selected yet
                    </p>
                  </div>
                )}

              </div>

              {/* Total */}

              <div className="border-t pt-5">

                <div className="flex justify-between items-end">

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{totalAmount}
                    </p>
                  </div>

                  {selectedSeats.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {selectedSeats.length}{" "}
                      {selectedSeats.length === 1
                        ? "seat"
                        : "seats"}
                    </span>
                  )}

                </div>

              </div>

              {/* Error */}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition"
              >
                Continue to Passenger Details
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeatSelection;