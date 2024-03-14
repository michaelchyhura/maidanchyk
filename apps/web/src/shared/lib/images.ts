import Compressor from "compressorjs";

export const compress = (image: File) => {
  return new Promise<File | Blob>((resolve, reject) => {
    new Compressor(image, {
      quality: 0.6,
      success: (result) => {
        resolve(result);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
