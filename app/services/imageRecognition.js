const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

let imageRecognition = {
  // intermediateProcessing: async (url)=>{
  //   await imageRecognition.brandDetection_clarifai_1(url);
  //   await imageRecognition.brandDetection_clarifai_2(url);
  // },
  brandDetection_clarifai_1: async (url) => {
    let pr = new Promise((res, rej) => {
      try {
        const stub = ClarifaiStub.grpc();
        const metadata = new grpc.Metadata();
        metadata.set("authorization", "Key 3e6ec2b987494316a5654ac9dbd89e25");
        stub.PostModelOutputs({
          // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
          model_id: "sameed_987654321",
          inputs: [{ data: { image: { url: `${url}` } } }]
        }, metadata, async (err, response) => {

          if (err) {
            console.log("Error: " + err);
            res([{ "name": "Error1", "value": err.message }]);
          }
          if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            res([{ "name": "Error1", "value": 0.0001 }]);
          } else {
            console.log(`Predicted concepts, with confidence values: DATE: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Calcutta', hour12: true })}`);

            let top_list = response.outputs[0].data.concepts.slice(0, 3);
            let result = top_list.reduce((acc, curr) => { acc.push({ "name": curr.name, "value": curr.value }); return acc }, []);
            // result.filter(obj=>obj.value>0.01)
            res(result);
          }

        });
      } catch (error) {
        res([{ "name": "Error1", "value": `${error.message}` }]);
      }
    });

    console.log(`Filter is processing.....`);

    return pr
  },
  brandDetection_clarifai_2: async (url) => {

    let pr = new Promise((res, rej) => {

      try {
        const stub = ClarifaiStub.grpc();

        const metadata = new grpc.Metadata();

        metadata.set("authorization", "Key 3e6ec2b987494316a5654ac9dbd89e25");

        stub.PostModelOutputs({
          // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
          model_id: "006764f775d210080d295e6ea1445f93",
          inputs: [{ data: { image: { url: `${url}` } } }]
        }, metadata, async (err, response) => {

          if (err) {
            console.log("Error: " + err);
            res([{ "name": "Error2", "value": `${err.message}` }]);
          } else if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            res([{ "name": "Error2", "value": 0.0001 }]);
          } else {
            console.log(`Predicted concepts, with confidence values: DATE: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Calcutta', hour12: true })}`);
            let top_list = response.outputs[0].data.regions.slice(0, 3);
            let result = top_list.reduce((acc, curr) => { acc.push({ "name": curr.data.concepts[0].name, "value": curr.data.concepts[0].value }); return acc }, []);
            console.log(result);
            res(result.filter(obj => obj.value > 0.75));
          }

          // let top_list = response.outputs[0].data.regions[0].data.concepts;

        });
      } catch (error) {
        res([{ "name": "Error2", "value": `${error.message}` }]);
      }
    });
    console.log(`Filter is processing.....`);
    return pr

  }
}

module.exports = imageRecognition;