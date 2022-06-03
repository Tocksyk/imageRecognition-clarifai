const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

let videoRecognition = {
  nsfw_detection: async () => { 
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key 598d1bd9b56144d5b77d013b93d35e97");
    stub.PostModelOutputs(
      {
        model_id: "ccc76d86d2004ed1a38ba0cf39ecb4b1",
        // version_id: "{THE_MODEL_VERSION_ID}",  // This is optional. Defaults to the latest model version.
        inputs: [
          { data: { video: { url: "https://samples.clarifai.com/beer.mp4" } } }
        ]
      },
      metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }
        console.log(response.outputs[0]);
        response.outputs[0].data.frames.forEach(element => {
          console.log(element.data);
        })
        if (response.status.code != 10000) {
          throw new Error("Post model outputs failed, status: ");
        }

        // Since we have one input, one output will exist here.
        const output = response.outputs[0]

        // A separate prediction is available for each "frame".
        for (const frame of output.data.frames) {
          console.log("Predicted concepts on frame " + frame.frame_info.time + ":");
          for (const concept of frame.data.concepts) {
            console.log("\t" + concept.name + " " + concept.value);
          }
        }
      }
    );
  },
  workflowModel: async () => {
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key 598d1bd9b56144d5b77d013b93d35e97");

    stub.PostWorkflowResults(
      {
        workflow_id: "General",
        inputs: [
          { data: { video: { url: "https://samples.clarifai.com/beer.mp4" } } }
        ]
      },
      metadata,
      (err, response) => {
        if (err) {
          throw new Error(err);
        }

        if (response.status.code !== 10000) {
          throw new Error("Post workflow results failed, status: " + response.status.description);
        }
        response.results[0].outputs[0].data.frames.forEach(element => {
          console.log(element.data.concepts[0]);
        });
        
        const results = response.results[0];

        // Each model we have in the workflow will produce one output.
        for (const output of results.outputs) {
          const model = output.model;

          console.log("Predicted concepts for the model `" + model.name + "`:");
          for (const concept of output.data.concepts) {
            console.log("\t" + concept.name + " " + concept.value);
          }
        }
      }
    );
  }
}

videoRecognition.workflowModel();