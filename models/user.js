const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const userSchema = new Schema(
  {
    // googleId: {
    //   type: String,
    //   required: true,
    // },
    // displayName: {
    //   type: String,
    //   required: true,
    // },
    // image: {
    //   type: String,
    // },
    username: {
      type: String,
      //required: true,
    },
    password: {
      type: String,
      //required: true,
    },
 
  },

  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
