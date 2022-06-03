const test_url = require("../data/urlLink");
const imageRecognition = require("../services/imageRecognition");


async function image_det(req,res){
  let arr = [imageRecognition.brandDetection_clarifai_1, imageRecognition.brandDetection_clarifai_2];
  let result = [];

  for await(const url of test_url) {
    for await (const fn of arr){
      result.push(await fn(url));
      console.log(`Filter is processing .....`);
    };
  };
  
  res.send(result);
  return
}

module.exports = image_det;