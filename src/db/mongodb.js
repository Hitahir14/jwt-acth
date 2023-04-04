const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://nagherah03:dCC7GQzHHht3QbVS@cluster0.twp1jjb.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connect with db");
  })
  .catch((error) => {
    console.log(error);
  });
