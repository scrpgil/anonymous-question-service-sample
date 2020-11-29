const Canvas = require('canvas');
const fs = require('fs');

export const createImage = async (text: string, bucket: any) => {
  const WIDTH = 975;
  const HEIGHT = 522;
  const CENTER_WIDTH = WIDTH / 2;
  const CENTER_HEIGHT = HEIGHT / 2;
  const FONT_SIZE = 42;
  const LINE_HEIGHT = 42;

  const Image = Canvas.Image;
  const localBaseImgPath = '/tmp/base.png';
  await bucket.file('base.png').download({ destination: localBaseImgPath });
  return new Promise(async resolve => {
    fs.readFile(localBaseImgPath, (err: any, data: any) => {
      const img = new Image();
      img.src = data;
      const canvas = new Canvas.Canvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.font = FONT_SIZE + 'px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      const texts = text.split(/\\n|\r\n|\r|\n/);
      const offset = (LINE_HEIGHT * (texts.length - 1)) / 2 + LINE_HEIGHT / 2;
      ctx.fillText(text, CENTER_WIDTH, CENTER_HEIGHT - offset);

      const blob = canvas.toBuffer('image/jpeg', {
        quality: 0.75,
        progressive: true,
        chromaSubsampling: true,
      });
      resolve(blob);
    });
  });
};

export const upload = (bucket: any, blob: any, filename: any, path: any) => {
  return new Promise((resolve) => {
    const newFile = bucket.file(path + "/" + filename);
    const blobStream = newFile.createWriteStream({
      metadata: {
        contentType: "image/jpeg",
      },
    });

    blobStream.end(blob, () => {
      resolve(true);
    });
  });
};
export const generateMessageImage = async (
  userId: string,
  ref: any,
  bucket: any
) => {
  const message = ref.data();
  const blob = await createImage(message.body, bucket);
  await upload(bucket, blob, ref.id + ".jpg", "users/" + userId);
};