const axios = require("axios");
const captainModel = require("../models/captain.model"); // Corrected the filename
const NodeCache = require("node-cache");

// Cache results for 24 hours
const locationCache = new NodeCache({ stdTTL: 86400 });

const getAddressCoordinates = async (address) => {
  try {
    // Check cache first
    const cachedResult = locationCache.get(address);
    if (cachedResult) {
      return cachedResult;
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "UberClone/1.0 (mehtadaksh85@gmail.com)",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const result = {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
        displayName: response.data[0].display_name,
        type: response.data[0].type,
      };

      locationCache.set(address, result);
      return result;
    }
    throw new Error("Location not found");
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Error getting coordinates: " + error.message);
  }
};

const getDistanceAndTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    // First get coordinates for both points if they're addresses
    const originCoords = await getAddressCoordinates(origin);
    const destCoords = await getAddressCoordinates(destination);

    // Use OSRM for routing
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}`,
      {
        params: {
          overview: "false",
          alternatives: false,
          steps: false,
        },
        headers: {
          "User-Agent": "UberClone/1.0 (mehtadaksh85@gmail.com)",
        },
      }
    );

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const route = response.data.routes[0];
      return {
        distance: {
          text: `${(route.distance / 1000).toFixed(1)} km`,
          value: route.distance, // in meters
        },
        duration: {
          text: `${Math.round(route.duration / 60)} mins`,
          value: route.duration, // in seconds
        },
      };
    }
    throw new Error("Route not found");
  } catch (error) {
    console.error("Routing error:", error);
    throw new Error("Error calculating route: " + error.message);
  }
};

const getAddressSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: input,
          format: "json",
          limit: 5,
          addressdetails: 1,
          countrycodes: "in", // Limit to India
          featuretype: "city,street,suburb,neighbourhood", // Focus on relevant places
          dedupe: 1, // Remove duplicates
        },
        headers: {
          "User-Agent": "UberClone/1.0 (mehtadaksh85@gmail.com)",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data.map((place) => {
        const address = place.address || {};
        const mainText =
          [address.road, address.suburb, address.neighbourhood].filter(
            Boolean
          )[0] || place.display_name.split(",")[0];

        const secondaryText = [
          address.city || address.town,
          address.state,
          "India",
        ]
          .filter(Boolean)
          .join(", ");

        return {
          placeId: place.place_id,
          description: place.display_name,
          mainText: mainText,
          secondaryText: secondaryText,
          location: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
          },
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Autocomplete error:", error);
    throw new Error("Error getting suggestions: " + error.message);
  }
};

const getNearestCaptainInRadius = async (lat, lng, radius,vehicleType) => {
  try {
    console.log("Searching for the nearest captain near:", {
      lat,
      lng,
      radius,
    });

    const captains = await captainModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] }, // Correct order: [longitude, latitude]
          distanceField: "distance", // Field to store the calculated distance
          maxDistance: radius * 1000, // Convert radius from kilometers to meters
          spherical: true,
        },
      },
      { $limit: 1 }, // Limit to the nearest captain
    ]);

    if (captains.length === 0) {
      console.log("No captains found in the specified radius.");
      return null;
    }

    console.log("Nearest captain found:", captains[0]);
    return captains[0];
  } catch (error) {
    console.error("Error finding the nearest captain in radius:", error);
    throw new Error("Error finding the nearest captain in radius");
  }
};

module.exports = {
  getAddressCoordinates,
  getDistanceAndTime,
  getAddressSuggestions,
  getNearestCaptainInRadius, // Keep only this function for finding captains
};
