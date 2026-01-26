import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Challenge from "@/lib/models/Challenge";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import unzipper from "unzipper";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
  } catch {
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

  const form = await req.formData();
  const bundle = form.get("bundle");
  const metadataRaw = form.get("metadata");

  if (!bundle || !metadataRaw) {
    return NextResponse.json(
      { success: false, message: "Missing bundle or metadata" },
      { status: 400 },
    );
  }

  let metadata;
  try {
    metadata = JSON.parse(metadataRaw);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid metadata JSON" },
      { status: 400 },
    );
  }

  const { name, author, description, category, value } = metadata;
  if (!name || !description || !category || !value) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 },
    );
  }

  /* ---------- create challenge ---------- */
  const challenge = await Challenge.create({
    name,
    author,
    description,
    category,
    value,
    type: "instance",
    visible: false,
    instance: {
      image: null,
      exposePort: 3000,
      timeout: 3600,
      buildStatus: "pending",
    },
  });

  /* ---------- filesystem ---------- */
  const challDir = path.join(
    process.cwd(),
    "uploads",
    challenge._id.toString(),
  );

  await fs.mkdir(challDir, { recursive: true });

  const zipPath = path.join(challDir, "bundle.zip");
  const buffer = Buffer.from(await bundle.arrayBuffer());
  await fs.writeFile(zipPath, buffer);

  await fsSync
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: challDir }))
    .promise();

  const files = await fs.readdir(challDir);
  console.log(files);

  if (!files.includes("Dockerfile")) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid challenge bundle: Dockerfile missing",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Instance challenge uploaded (build pending)",
      challenge,
    },
    { status: 201 },
  );
}
