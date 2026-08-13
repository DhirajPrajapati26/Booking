import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Bus,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Armchair,
} from "lucide-react";
import api from "../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const travelDate = searchParams.get("travelDate");

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchTrips = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/trips/search", {
          params: {
            source,
            destination,
            travelDate,
          },
        });

        setTrips(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to search trips"
        );
      } finally {
        setLoading(false);
      }
    };

    searchTrips();
  }, [source, destination, travelDate]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const calculateDuration = (departure, arrival) => {
    const [departureHour, departureMinute] =
      departure.split(":").map(Number);

    const [arrivalHour, arrivalMinute] =
      arrival.split(":").map(Number);

    let departureTotal =
      departureHour * 60 + departureMinute;

    let arrivalTotal =
      arrivalHour * 60 + arrivalMinute;

    if (arrivalTotal < departureTotal) {
      arrivalTotal += 24 * 60;
    }

    const duration = arrivalTotal - departureTotal;

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-5 font-medium">
            Searching for buses...
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Finding the best available journeys
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md w-full">

          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Bus
              size={26}
              className="text-red-500"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            Search Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">


        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-6"
        >
          <ArrowLeft size={18} />
          Modify Search
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-gray-500 mb-2">
                Available bus journeys
              </p>

              <div className="flex items-center gap-3 flex-wrap">

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {source}
                </h1>

                <ArrowRight
                  size={22}
                  className="text-indigo-500"
                />

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {destination}
                </h1>

              </div>

              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <CalendarDays size={17} />

                <span>
                  {formatDate(travelDate)}
                </span>
              </div>

            </div>

            <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl flex items-center gap-2 self-start md:self-center">

              <Bus size={18} />

              <span className="font-semibold">
                {trips.length}{" "}
                {trips.length === 1
                  ? "bus"
                  : "buses"}{" "}
                found
              </span>

            </div>

          </div>

        </div>

        {/* No Trips */}

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Bus
                size={30}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No buses found
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find any available buses for
              this route and date. Try another date or
              search for a different route.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Search Again
            </button>

          </div>
        ) : (
          <div className="space-y-5">

            {trips.map((trip) => {

              const availableSeats =
                trip.seats?.filter(
                  (seat) => seat.status === "available"
                ).length || 0;

              const isSoldOut =
                availableSeats === 0;

              const duration = calculateDuration(
                trip.departureTime,
                trip.arrivalTime
              );

              return (
                <div
                  key={trip._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  <div className="p-5 sm:p-6">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                      {/* Bus */}

                      <div className="lg:col-span-3">

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                            <Bus
                              size={25}
                              className="text-indigo-600"
                            />
                          </div>

                          <div className="min-w-0">

                            <h2 className="font-bold text-gray-900 truncate">
                              {trip.busId.operator}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              {trip.busId.busNumber}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Journey */}

                      <div className="lg:col-span-4">

                        <div className="flex items-center gap-4">

                          {/* Departure */}

                          <div className="min-w-fit">

                            <p className="text-2xl font-bold text-gray-900">
                              {trip.departureTime}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {source}
                            </p>

                          </div>

                          {/* Duration */}

                          <div className="flex-1 min-w-[70px]">

                            <div className="flex items-center gap-2">

                              <div className="h-px bg-gray-300 flex-1" />

                              <Clock
                                size={17}
                                className="text-indigo-500 shrink-0"
                              />

                              <div className="h-px bg-gray-300 flex-1" />

                            </div>

                            <p className="text-xs text-gray-400 text-center mt-1">
                              {duration}
                            </p>

                          </div>

                          {/* Arrival */}

                          <div className="text-right min-w-fit">

                            <p className="text-2xl font-bold text-gray-900">
                              {trip.arrivalTime}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {destination}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Price */}

                      <div className="lg:col-span-2">

                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Price / seat
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          ₹{trip.busId.price}
                        </p>

                        <div
                          className={`flex items-center gap-1.5 text-sm mt-2 ${
                            isSoldOut
                              ? "text-red-500"
                              : availableSeats <= 5
                              ? "text-orange-500"
                              : "text-green-600"
                          }`}
                        >

                          <Armchair size={16} />

                          <span>
                            {isSoldOut
                              ? "Sold out"
                              : availableSeats <= 5
                              ? `Only ${availableSeats} left`
                              : `${availableSeats} seats available`}
                          </span>

                        </div>

                      </div>

                      {/* Button */}

                      <div className="lg:col-span-3 lg:flex lg:justify-end">

                        {isSoldOut ? (
                          <button
                            disabled
                            className="w-full lg:w-auto bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
                          >
                            Sold Out
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(
                                `/trip/${trip._id}`
                              )
                            }
                            className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
                          >
                            Select Seats
                          </button>
                        )}

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

export default SearchResults;