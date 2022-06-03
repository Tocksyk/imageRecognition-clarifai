const brand_detect = require("./controllers/brand_detection");
const image_det = require("./controllers/image_detection");
const textRecognition = require("./services/textRecognition");


module.exports = function (app){
  app.route(`/test`).get((req,res)=>{res.send(`Image Recognition is working .....`)});
  app.route(`/image/detection`).post(image_det);
  app.route(`/text/detection`).post(textRecognition.ocr_clarifai1);
  app.route(`/brand/detection`).post(brand_detect);
};