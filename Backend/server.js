const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
