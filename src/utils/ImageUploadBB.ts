import fs from 'fs';
import imgbbUploader from 'imgbb-uploader'

function toBase64(image) {
  const img = fs.readFileSync(image.path);
  return Buffer.from(img).toString('base64');
}

const uploadImageToImageBB = async (image): Promise<string> => {
  return imgbbUploader({ apiKey: process.env.IMGBB_APIKEY, base64string: toBase64(image) })
    .then((response) => { fs.unlinkSync(image.path); return response.url })

};

export default uploadImageToImageBB