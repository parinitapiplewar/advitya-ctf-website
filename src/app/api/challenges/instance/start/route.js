import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import util from "util";
import { execFile } from "child_process";

import connectDB from "@/lib/db";
import Challenge from "@/lib/models/Challenge";
import Team from "@/lib/models/Team";
import Instance from "@/lib/models/Instance";

const execFileAsync = util.promisify(execFile);

/* ---------- helpers ---------- */

function generateAccessToken() {
  return crypto.randomBytes(4).toString("hex");
}

function generateFlag(teamId, challengeId) {
  const hmac = crypto.createHmac("sha256", process.env.FLAG_SECRET);
  hmac.update(`${teamId}:${challengeId}`);
  return `flag{${hmac.digest("hex").slice(0, 16)}}`;
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET,
    );

    const { challengeId } = await req.json();

    await connectDB();

    const team = await Team.findOne({ members: decoded.userId });
    if (!team) {
      return NextResponse.json(
        { success: false, message: "User not in a team" },
        { status: 403 },
      );
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge || challenge.type !== "instance") {
      return NextResponse.json(
        { success: false, message: "Invalid instance challenge" },
        { status: 400 },
      );
    }

    if (challenge.instance.buildStatus !== "built") {
      return NextResponse.json(
        { success: false, message: "Challenge not built yet" },
        { status: 400 },
      );
    }

    const existing = await Instance.findOne({
      team: team._id,
      challenge: challenge._id,
      status: "running",
      expiresAt: { $gt: new Date() },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        url: `http://${existing.accessToken}.umairmalik.space`,
        expiresAt: existing.expiresAt,
      });
    }

    /* ---- Docker instance Creation ---- */
    const accessToken = generateAccessToken();
    const flag = generateFlag(team._id, challenge._id);

    const containerName = `inst_${challenge._id}_${team._id}`;
    const image = challenge.instance.image;

    await execFileAsync("docker", [
      "run",
      "-d",
      "--name",
      containerName,
      "--network",
      "traefik_default",

      "--label",
      "traefik.enable=true",
      "--label",
      `traefik.http.routers.${containerName}.rule=Host(\`${accessToken}.umairmalik.space\`)`,
      "--label",
      // `traefik.http.services.${containerName}.loadbalancer.server.port=80`,
      `traefik.http.services.${containerName}.loadbalancer.server.port=3000`,

      "-e",
      `FLAG=${flag}`,
      "--memory=256m",
      "--cpus=0.5",

      //new
      "--pids-limit=64",
      "--security-opt",
      "no-new-privileges",
      "--cap-drop",
      "ALL",
      "--read-only",
      "--tmpfs",
      "/tmp",

      image,
    ]);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await Instance.create({
      team: team._id,
      challenge: challenge._id,
      containerId: containerName,
      flag,
      accessToken,
      expiresAt,
      status: "running",
    });

    return NextResponse.json({
      success: true,
      url: `https://${accessToken}.umairmalik.space`,
      expiresAt,
    });
  } catch (err) {
    console.error("INSTANCE_START_ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Failed to start instance" },
      { status: 500 },
    );
  }
}
