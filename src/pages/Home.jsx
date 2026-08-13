import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  MapPin,
  CalendarDays,
  Search,
  ShieldCheck,
  Armchair,
  Ticket,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

const Home = () => {
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const [loadingLocations, setLoadingLocations] =
    useState(true);

  const [error, setError] = useState("");

  // Today's date
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // Fetch buses
  useEffect(() => {
    const getBuses = async () => {
      try {
        setLoadingLocations(true);

        const response = await api.get("/buses/get");

        setBuses(response.data.buses || response.data);
      } catch (error) {
        console.error("Failed to load buses:", error);

        setError(
          "Unable to load available routes."
        );
      } finally {
        setLoadingLocations(false);
      }
    };

    getBuses();
  }, []);

  // Get unique source locations
  const sources = [
    ...new Set(
      buses
        .map((bus) => bus.source)
        .filter(Boolean)
    ),
  ];

  // Get destinations based on selected source
  const destinations = [
    ...new Set(
      buses
        .filter((bus) => bus.source === source)
        .map((bus) => bus.destination)
        .filter(Boolean)
    ),
  ];

  const handleSourceChange = (e) => {
    setSource(e.target.value);

    // Reset destination when source changes
    setDestination("");

    setError("");
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setError("");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!source || !destination || !travelDate) {
      setError(
        "Please select source, destination and travel date."
      );
      return;
    }

    if (source === destination) {
      setError(
        "Source and destination cannot be the same."
      );
      return;
    }

    setError("");

    navigate(
      `/search?source=${encodeURIComponent(
        source
      )}&destination=${encodeURIComponent(
        destination
      )}&travelDate=${travelDate}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">



      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 text-white">

        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full" />

        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-purple-400/10 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full mb-7">

              <Bus size={19} />

              <span className="text-sm font-medium">
                BusBook
              </span>

            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Your journey starts
              <span className="text-indigo-200">
                {" "}here.
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-indigo-100 max-w-2xl leading-relaxed">
              Search buses, choose your preferred
              seats, and book your journey quickly
              and easily.
            </p>

            <div className="flex flex-wrap gap-5 mt-8 text-sm text-indigo-100">

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                Secure booking
              </div>

              <div className="flex items-center gap-2">
                <Armchair size={18} />
                Choose your seat
              </div>

              <div className="flex items-center gap-2">
                <Ticket size={18} />
                Easy ticket management
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Search Card */}

      <section className="max-w-6xl mx-auto px-5 sm:px-6 -mt-10 relative z-10">

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-7"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="bg-indigo-100 p-2.5 rounded-lg">
              <Search
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Find your bus
              </h2>

              <p className="text-sm text-gray-500">
                Select your route and travel date
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Source */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                From
              </label>

              <div className="relative">

                <MapPin
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                />

                <select
                  value={source}
                  onChange={handleSourceChange}
                  disabled={loadingLocations}
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >

                  <option value="">
                    {loadingLocations
                      ? "Loading locations..."
                      : "Select source"}
                  </option>

                  {sources.map((location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* Destination */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                To
              </label>

              <div className="relative">

                <MapPin
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                />

                <select
                  value={destination}
                  onChange={handleDestinationChange}
                  disabled={
                    !source ||
                    destinations.length === 0
                  }
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >

                  <option value="">
                    {!source
                      ? "Select source first"
                      : destinations.length === 0
                        ? "No destinations"
                        : "Select destination"}
                  </option>

                  {destinations.map((location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* Date */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Travel Date
              </label>

              <div className="relative">

                <CalendarDays
                  size={19}
                  className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                />

                <input
                  type="date"
                  min={today}
                  value={travelDate}
                  onChange={(e) => {
                    setTravelDate(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-xl py-3.5 pl-11 pr-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />

              </div>

            </div>

            {/* Search */}

            <div className="flex items-end">

              <button
                type="submit"
                disabled={loadingLocations}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >

                <Search size={19} />

                Search Buses

              </button>

            </div>

          </div>

         

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

        </form>

      </section>

      {/* Features */}

      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-20">

        <div className="text-center mb-10">

          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">
            Simple booking experience
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Everything you need for your journey
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Find your bus, choose your seat, and manage
            your booking from one place.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">

              <Bus
                className="text-indigo-600"
                size={25}
              />

            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Find Your Bus
            </h3>

            <p className="text-gray-500 mt-2 leading-relaxed">
              Search available buses by route and
              travel date to find the journey that
              suits you.
            </p>

          </div>

          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5">

              <Armchair
                className="text-purple-600"
                size={25}
              />

            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Choose Your Seat
            </h3>

            <p className="text-gray-500 mt-2 leading-relaxed">
              View the seat layout and select the
              seats you prefer before confirming
              your journey.
            </p>

          </div>


          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition">

            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">

              <Ticket
                className="text-green-600"
                size={25}
              />

            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Manage Your Ticket
            </h3>

            <p className="text-gray-500 mt-2 leading-relaxed">
              View your booking details, track your
              tickets, and cancel eligible bookings
              when needed.
            </p>

          </div>

        </div>

      </section>



      <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-16">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">

          <div>

            <h2 className="text-2xl font-bold">
              Ready for your next journey?
            </h2>

            <p className="text-indigo-100 mt-2">
              Search available buses and book your
              seat today.
            </p>

          </div>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition flex items-center gap-2 whitespace-nowrap"
          >
            Search Buses
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

    </div>
  );
};

export default Home;