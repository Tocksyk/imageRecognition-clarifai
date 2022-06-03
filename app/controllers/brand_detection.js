const imageRecognition = require("../services/imageRecognition");
const textRecognition = require("../services/textRecognition");

async function brand_detect(req,res){
  let {url} = req.body;
  console.log(url);
  let result = [];
  try {
    let promise_arr = [
      imageRecognition.brandDetection_clarifai_1(url),
      imageRecognition.brandDetection_clarifai_2(url)
    ];
    
    let new_arr = [];
    
    let promise_result = await Promise.all(promise_arr);

    console.log(`Promise : ${JSON.stringify(promise_result)}`);
    
    let ocr = await textRecognition.ocr_tessaract(url);
    result.push(ocr)
    for await (const fn of image_fn){
      result.push(await fn(url));
      console.log(`Filter is processing .....`);
    };

    
    promise_result.forEach(arr => {
      new_arr.push(...arr);
    });
    
    console.log(new_arr.sort((a,b)=>{return b.value - a.value}));

    res.send({
      success: 1,
      message: (()=>{
        if(result.length == 1){
          return `Text Recognized`;
        }else{
          return `Image Recognized`;
        }
      })(),
      data: new_arr.sort((a,b)=>{return b.value - a.value}).slice(0,3)
    })
  } catch (error) {
    console.log(`${error.message}`);
    res.send({
      success: 0,
      data: result.join()
    });
  }
  return
};

module.exports = brand_detect