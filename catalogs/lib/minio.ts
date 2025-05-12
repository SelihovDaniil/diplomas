import * as Minio from "minio";

export const minio = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: +(process.env.MINIO_PORT as string),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY as string,
  secretKey: process.env.MINIO_SECRET_KEY as string,
});

export const bucket = "catalogs";
