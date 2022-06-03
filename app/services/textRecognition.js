const Tesseract = require('tesseract.js');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

// https://www.apparelresources.com/wp-content/uploads/2016/10/allen-solly-ikat-collection.jpg

let textRecognition = {
  ocr_tessaract : async (url)=>{
    let pr = new Promise(async (res,rej)=>{
      try {
        let array_of_brands = ['just do it','wikipedia','allen solly', 'peter england', 'givenchy','nike','reebok'];
  
        let brand_string = await Tesseract.recognize(
          `${url}`,
          'eng'
        );
        let ocr = brand_string.data.text;
        console.log(`BRAND TEXT : ${ocr}`);
        let brand_name = [...array_of_brands.filter(data => ocr.toLowerCase().includes(data))];
        
        if(brand_name.length == 0){
          res([]);
        };
        res([{name:brand_name[0],value:0.9999999999999}]);
      } catch (error) {
        res([]);
      }
    })
    
    console.log(`Filter is processing.....`);
    
    return pr
  },
  ocr_clarifai1 : async (req,res)=>{
    let {url} = req.body;
    const stub = ClarifaiStub.grpc();
        const metadata = new grpc.Metadata();

        metadata.set("authorization", "Key 02240daeff7249bd8bf2a9cf43650b0c");

        stub.PostModelOutputs({
          // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
          model_id: "9fe78b4150a52794f86f237770141b33",
          inputs: [{ data: { image: { url: `${url}` } } }],
          model: {output_info: {output_config: {language: "en"}}}
        }, metadata, async (err, response) => {

          if (err) {
            console.log("Error: " + err);
            res.send([{ "name": "Error2", "value": `${err.message}` }]);
          }

          if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            res.send([{ "name": "Error2", "value": 0.0001 }]);
          }
          
          res.send(response);
        });
        return
  },
  ocr_clarifai_2 : async ()=>{
    
  }
}


module.exports = textRecognition