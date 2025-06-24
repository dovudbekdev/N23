const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const userFilePath = path.join(__dirname, "db", "user.json");

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log("method =>", method);
  console.log("url =>", url);

  if (method === "POST") {
    if (url === "/resume") {
      const userData = fs.readFileSync(userFilePath, "utf-8");
      const users = userData ? JSON.parse(userData) : [];
      const userId = users.at(-1) ? users.at(-1)?.id + 1 : 1;

      let html = `
      <!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Firdavs Abdiazizov - Resume</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
        <h1>${userInfo.fullname}</h1>
  </body>
</html>
      `;
      /**
       * Body parser
       */
      let body = "";
      const userInfo = { id: userId };
      req.on("data", (data) => {
        body = body + data.toString();
      });

      req.on("end", () => {
        body.split("&").forEach((item) => {
          userInfo[item.split("=")[0]] = item.split("=")[1];
        });

        users.push(userInfo);
        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (error) => {
          if (error) {
            res.end(error.message);
            return;
          }
        });
        console.log("userInfo", userInfo);

        fs.writeFileSync("public/index.html", html);
        res.end(html);
        return;
      });

      // res.writeHead(201, {
      //   "content-type": "application/json"
      // })
    }
  }

  /**
   * Not Found route
   */
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Server ${PORT}da ishladi`);
});
