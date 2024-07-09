// app/api/download/route.ts

import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  const { playlistUrl } = await request.json();

  if (!playlistUrl) {
    return NextResponse.json(
      { message: "Playlist URL is required" },
      { status: 400 }
    );
  }

  const scriptPath = path.join(process.cwd(), "scripts/download.py");
  const downloadFolder = path.join(process.cwd(), "public/downloads");

  return new Promise<Response>((resolve) => {
    exec(`python3 ${scriptPath} ${playlistUrl}`, (error, stdout, stderr) => {
      if (error) {
        resolve(
          NextResponse.json({ message: `Error: ${stderr}` }, { status: 500 })
        );
      } else {
        const zipFilePath = stdout.trim(); // Assuming the script outputs the zip file path

        // Example file name extraction
        const zipFileName = path.basename(zipFilePath);

        resolve(
          NextResponse.json({
            downloadLink: `/downloads/${encodeURIComponent(zipFileName)}`,
          })
        );
      }
    });
  });
}
