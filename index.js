const http = require('http');
const fs = require('fs');
const path = require('path');
const requests = require('requests');
const url = require("url");

// Getting HTML file
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    if (!orgVal.main || !orgVal.sys || !orgVal.weather) {
        return tempVal.replace("{%tempval%}", "N/A")
                      .replace("{%tempmin%}", "N/A")
                      .replace("{%tempmax%}", "N/A")
                      .replace("{%location%}", "Unknown")
                      .replace("{%country%}", "Unknown")
                      .replace("{%tempStatus%}", "N/A");
    }

    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    console.log(`${ orgVal.weather[0].main}`);
    return temperature;
};

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;

    if (pathname === "/") {
        const city = reqUrl.query.city ; // Default to 'pune' if no city is provided
        console.log(`${city}`); // Debugging line
        const apiKey = "a19cb112564b9350d7ca63f1b234cf37";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        requests(apiUrl)
            .on("data", function (chunk) {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                const realTimeData = arrdata
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
            })
            .on("end", function (err) {
                if (err) {
                    console.log("Connection closed", err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end("Error fetching data");
                } else {
                    res.end();
                }
            });
    } else if (pathname === "/style.css") {
        // Serving the CSS file
        fs.readFile(path.join(__dirname, "style.css"), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
    }
});

server.listen(9000, () => {
    console.log("Server started on port 9000");
});
