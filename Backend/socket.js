const { Server } = require("socket.io");
const userModel = require("./models/user.model"); // Adjust the path as needed
const captainModel = require("./models/captain.model"); // Adjust the path as needed
const { createRide } = require("./controllers/ride.controller");
const { updateCaptainLocation } = require("./services/captain.service");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for development
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      console.log(
        `User ${userId} of type ${userType} joined with socket ID: ${socket.id}`
      );

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {

      try {
        const { captainId, location } = data;

        if (!captainId || !location) {
          console.error("Invalid data for location update:", data);
          return;
        }

        await updateCaptainLocation(captainId, location);
      } catch (error) {
        console.error("Error updating captain location:", error);
      }
    });

    socket.on("ride-captain", async (data) => {
      console.log("ride-captain event received with data:", data);

      try {
        // Call createRide function with the data
        const req = { body: data, user: { _id: data.userId } }; // Mock request object
        const res = {
          status: (code) => ({
            json: (response) => console.log("Response sent:", code, response),
          }),
          headersSent: false,
        };

        await createRide(req, res);
      } catch (error) {
        console.error("Error handling ride-captain event:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const sendMessageToSocketId = (socketId, messageObject) => {
  if (io && io.sockets.sockets.get(socketId)) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    console.log(`Message sent to socket ${socketId}:`, messageObject);
  } else {
    console.error(`Socket with ID ${socketId} not found.`);
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
