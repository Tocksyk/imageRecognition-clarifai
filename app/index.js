let express = require("express");
let cors = require("cors");
let routes = require("./routes");
const brand_detect = require("./controllers/brand_detection");

process.env.UV_THREADPOOL_SIZE = 64;

let app = express();
const port = "20201";

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

routes(app);

app.listen(port, function () {
  console.log(`Application coutlootImagerecognition started on port: ${port}`);
});
