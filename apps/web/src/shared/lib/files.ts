import Compressor from "compressorjs";

export const compress = <T extends File | Blob>(image: T) => {
  return new Promise<T>((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(image, {
      quality: 0.6,
      success: (result) => {
        resolve(result as T);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const toHumanSize = (bytes: number, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    // eslint-disable-next-line no-param-reassign
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)  } ${  units[u]}`;
};
