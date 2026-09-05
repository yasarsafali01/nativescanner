import { Skia, ColorType, AlphaType, ImageFormat } from "@shopify/react-native-skia";
import { File } from "expo-file-system";

/** Reads a local image file (uri) and decodes it to a raw RGBA8 buffer. */
export function decodeToRaw(uri) {
  const fileBytes = new File(uri).bytesSync();
  const skData = Skia.Data.fromBytes(fileBytes);
  const image = Skia.Image.MakeImageFromEncoded(skData);
  if (!image) throw new Error("Fotoğraf çözümlenemedi.");

  const width = image.width();
  const height = image.height();
  const pixels = image.readPixels(0, 0, {
    width,
    height,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  });
  if (!pixels) throw new Error("Fotoğraf piksel verisi okunamadı.");

  return { data: pixels instanceof Uint8Array ? pixels : new Uint8Array(pixels), width, height };
}

/** Encodes a raw RGBA8 buffer to JPEG bytes. */
export function encodeRawToJpeg({ data, width, height }, quality = 88) {
  const skData = Skia.Data.fromBytes(data instanceof Uint8Array ? data : new Uint8Array(data));
  const image = Skia.Image.MakeImage(
    { width, height, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Unpremul },
    skData,
    width * 4
  );
  if (!image) throw new Error("Görüntü kodlanamadı.");
  return image.encodeToBytes(ImageFormat.JPEG, quality);
}
