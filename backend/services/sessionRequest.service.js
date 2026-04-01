import SessionRequest from "../models/SessionRequest.js";
import { v4 as uuidv4 } from "uuid";

export const createRequest = async (data) => {
  return await SessionRequest.create(data);
};

export const getTeacherRequests = async (teacherId) => {
  return await SessionRequest.find({ teacherId })
    .populate("studentId", "name email")
    .populate("courseId", "title");
};

export const updateStatus = async (requestId, status) => {
  const update = { status };

  if (status === "ACCEPTED") {
    update.sessionRoomId = uuidv4();
  }

  return await SessionRequest.findByIdAndUpdate(requestId, update, {
    new: true,
  });
};
