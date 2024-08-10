import base64url from 'base64url';
import crypto from 'crypto';

function generateHashTime(fileBuffer: Buffer): string {
  const hashBuffer = crypto.createHash('sha1').update(fileBuffer).digest();

  const currentTime = BigInt(new Date().getTime());
  const timeBuffer = Buffer.allocUnsafe(8);
  timeBuffer.writeBigUInt64BE(currentTime, 0);

  const buffer = Buffer.concat([hashBuffer, timeBuffer]);

  const filename = base64url.encode(buffer);
  return filename;
}

function getHash(filename: string): Buffer {
  const fileNameBuffer = base64url.toBuffer(filename);
  const hashBytes = fileNameBuffer.subarray(0, 20);
  return hashBytes;
}

function getTime(filename: string): bigint {
  const fileNameBuffer = base64url.toBuffer(filename);
  const timestamp = fileNameBuffer.readBigUInt64BE(20);
  return timestamp;
}

export { generateHashTime, getHash, getTime };
