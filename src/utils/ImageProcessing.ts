import fs from 'fs';
import sharp from 'sharp';
import imgbbUploader from 'imgbb-uploader'

function toBase64(imageBuffer: Buffer) {
  return Buffer.from(imageBuffer).toString('base64');
}

const ImageProcessing = async ({ image, width = 200, height = 200 }: { image: any, width: number, height: number }): Promise<string> => {
  const ImageBuffer = await sharp(image.path)
    .resize(width, height)
    .webp()
    .toBuffer();
  return imgbbUploader({ apiKey: process.env.IMGBB_APIKEY, base64string: toBase64(ImageBuffer) })
    .then((response) => { fs.unlinkSync(image.path); return response.url })
};

export default ImageProcessing