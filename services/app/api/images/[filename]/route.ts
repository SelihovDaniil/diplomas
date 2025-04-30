import { bucket, minio } from "@/lib/minio";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) => {
  const { filename } = await params;
  try {
    const dataStream = await minio.getObject(bucket, filename);

    const chunks = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer);
  } catch (error) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
};
