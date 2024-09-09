import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const routeSegmentConfig = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return resolve(NextResponse.json({ error: '이미지 업로드 중 오류가 발생했습니다.' }, { status: 500 }));
      }

      const file = files.file[0];
      const filePath = `/uploads/${path.basename(file.filepath)}`;
      console.log('Uploaded file:', filePath);
      return resolve(NextResponse.json({ url: filePath }));
    });
  });
}
