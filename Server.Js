const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const server = http.createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    "views",
    req.url === "/" ? "index.html" : req.url + ".html"
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");

      // Emit event for file read failure
      myEmitter.emit("fileReadFailure", filePath);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);

      // Emit event for successful file read
      myEmitter.emit("fileReadSuccess", filePath);
    }
  });

  // Emit event for specific route access
  if (req.url === "/contact") {
    myEmitter.emit("specificRouteAccess", req.url);
  }
});

// Listen for fileReadSuccess event and log a message
myEmitter.on("fileReadSuccess", (filePath) => {
  console.log(`File successfully read: ${filePath}`);
});

// Listen for fileReadFailure event and log a message
myEmitter.on("fileReadFailure", (filePath) => {
  console.log(`Failed to read file: ${filePath}`);
});

// Listen for specificRouteAccess event and log a message
myEmitter.on("specificRouteAccess", (route) => {
  console.log(`Accessed specific route: ${route}`);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
