import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Team from "@/lib/models/Team";
import Notification from "@/lib/models/Notification";
import {
  broadcast,
  broadcastToTeam,
  broadcastToUser,
} from "@/lib/socket";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  await connectDB();

  const adminUser = await User.findById(decoded.userId);

  if (!adminUser || decoded.role !== "sudo" || adminUser.role !== "sudo") {
    return NextResponse.json(
      { success: false, message: "Forbidden: Not Admin" },
      { status: 403 },
    );
  }

  const { target, targetId, event } = await req.json();

  if (!target || !event?.type || !event?.message) {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 },
    );
  }

  if (target === "global") {
    const noti = await Notification.create({
      type: event.type,
      message: event.message,
      level: event.level || "info",
      scope: "global",
      sentBy: adminUser._id,
    });

    broadcast({
      ...event,
      notificationId: noti._id,
    });

    return NextResponse.json({
      success: true,
      sentTo: "global",
      id: noti._id,
    });
  }

  /* PER USER */
  if (target === "user") {
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const user = await User.findById(targetId).select("_id username");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const noti = await Notification.create({
      type: event.type,
      message: event.message,
      level: event.level || "info",
      scope: "user",
      targetUser: user._id,
      sentBy: adminUser._id,
    });

    broadcastToUser(user._id.toString(), {
      ...event,
      notificationId: noti._id,
    });

    return NextResponse.json({
      success: true,
      sentTo: "user",
      user: user.username,
      id: noti._id,
    });
  }

  /* PER TEAM */
  if (target === "team") {
    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "Team ID required" },
        { status: 400 },
      );
    }

    const team = await Team.findById(targetId).select("_id name members");

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 },
      );
    }

    const noti = await Notification.create({
      type: event.type,
      message: event.message,
      level: event.level || "info",
      scope: "team",
      targetTeam: team._id,
      sentBy: adminUser._id,
    });

    broadcastToTeam(team._id.toString(), {
      ...event,
      notificationId: noti._id,
    });

    return NextResponse.json({
      success: true,
      sentTo: "team",
      team: team.name,
      members: team.members.length,
      id: noti._id,
    });
  }

  return NextResponse.json(
    { success: false, message: "Unsupported target" },
    { status: 400 },
  );
}
