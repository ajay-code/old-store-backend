import mongoose from "mongoose";

function connectMongo(mongo_uri) {
  return mongoose.connect(mongo_uri).then(() => {
    console.log("CONNECTED TO THE DB");
  });
}

export default connectMongo;
