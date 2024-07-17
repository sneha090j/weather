const http = require('http');

const sample = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" integrity="sha512-PgQMlq+nqFLV4ylk1gwUOgm6CtIIXkKwaIHp/PAIWHzig/lKZSEGKEysh0TCVbHJXCLN7WetD8TFecIky75ZfQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>Weather App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="s"> sample test </div>
  <script>

var s = document.getElementById("s");
s.innerText = "hello";

</script>
</body>

</html>
`

const requestListener = function(req,res) {
    res.setHeader("Content-Type", "text/html");
    res.end(sample);
}

const server = http.createServer(requestListener);

server.listen(9000,()=>{
    console.log("server started");
})
