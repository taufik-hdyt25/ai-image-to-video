import { configEnv } from "@/lib/configEnv";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: configEnv.apiImageToVideoKey,
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      fps = 24,
      duration = 5,
      resolution = "1080p",
      aspect_ratio = "16:9",
      camera_fixed = false,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const output = await replicate.run("bytedance/seedance-1-pro", {
      input: {
        prompt,
        fps,
        duration,
        resolution,
        aspect_ratio,
        camera_fixed,
      },
    });

    return NextResponse.json({ video: output });
  } catch (err: any) {
    console.error("REPLICATE ERROR:", err); //
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
