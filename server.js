// D:\Backend\server.js New server.js file
require('dotenv').config(); // Loads environment variables from .env file
const cli = require('next/dist/cli/next-start');
cli.nextStart({
  port: process.env.PORT || 4000, // Use the port Plesk assigns, or 4000 as fallback
  hostname: '0.0.0.0', // Listen on all network interfaces
});
