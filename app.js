const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const db = require("./models");
const port = process.env.PORT || 8081;
// app setup
app.use(cors());
app.use(bodyParser.json());

// all the routes
app.use("/api/auth", authRoutes);
app.use("/api/users/:id/messages", loginRequired, ensureCorrectUser, messagesRoutes);

app.get("/api/messages", loginRequired, async (req, res, next) => {
  try {
    let messages = await db.Message.find()
      .sort({ createdAt: "desc" })
      .populate("user", {
        username: true,
        profileImageUrl: true
      });
    return res.status(200).json(messages);
  } catch (error) {
    return next(error);
  }
});

// error handler
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
