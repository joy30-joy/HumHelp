import Request from "../models/Request.js";
import User from "../models/User.js";

export const getRequests = async (req, res) => {
  const requests = await Request.find({
    $or: [
      { requester: req.user._id },
      { recipient: req.user._id }
    ]
  })
    .populate("requester", "name email role")
    .populate("recipient", "name email role")
    .sort({ createdAt: -1 });
  res.json(requests);
};

export const createRequest = async (req, res) => {
  const { recipientId, message } = req.body;
  if (!recipientId || !message) return res.status(400).json({ message: "Recipient and message required" });

  const recipient = await User.findById(recipientId);
  if (!recipient) return res.status(404).json({ message: "Recipient not found" });

  const reqDoc = await Request.create({
    recipient: recipientId,
    requester: req.user._id,
    message
  });
  await reqDoc.populate("requester", "name email role");
  await reqDoc.populate("recipient", "name email role");
  res.status(201).json(reqDoc);
};

export const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  const request = await Request.findById(req.params.id)
    .populate("requester", "name email role")
    .populate("recipient", "name email role");

  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.recipient._id.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });
  if (!["pending", "accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

  request.status = status;
  await request.save();

  if (status === "accepted") {
    await User.findByIdAndUpdate(request.recipient._id, { $inc: { points: 10 } });
  }

  res.json(request);
};
