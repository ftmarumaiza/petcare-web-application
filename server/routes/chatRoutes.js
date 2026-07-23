const express = require("express");
const router = express.Router();
const { sendMessage, streamMessage, getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").post(sendMessage).get(getChatHistory);
router.post("/stream", streamMessage);

module.exports = router;
