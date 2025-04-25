const http = require('http');
const app = require('./app');

// Create HTTP server
const server = http.createServer(app);

// Set server to listen on port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
