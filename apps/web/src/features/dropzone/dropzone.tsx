import Image from "next/image";
import type { FileError } from "react-dropzone";
import { ErrorCode, useDropzone } from "react-dropzone";
import { ImageUp, Images, Trash2 } from "lucide-react";
import { Button, cn } from "@maidanchyk/ui";
import type { CourtAsset } from "@maidanchyk/prisma";
import { uniq } from "../../shared/lib/arrays";
import { toHumanSize } from "../../shared/lib/files";

const localizeDropzoneError = (error: FileError) => {
  switch (error.code) {
    case ErrorCode.FileInvalidType:
      return `Підтримуються лише PNG, JPG, JPEG файли`;
    case ErrorCode.FileTooLarge:
      return `Розмір файлу не повинен перевищувати 3MB`;
    // case ErrorCode.FileTooSmall:
    //   return `アップロードできる最小ファイルサイズは${convertByte(minFileByte)}です`;
    case ErrorCode.TooManyFiles:
      return "Занадто багато файлів";
    default:
      return error.message;
  }
};

type Asset = Omit<CourtAsset, "createdAt" | "updatedAt">;

interface Props {
  value: (File | Asset)[];
  onChange: (files: (File | Asset)[]) => void;
  onError: (errors: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function Dropzone({ value, onChange, onError, maxFiles, disabled }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDropAccepted: async (files) => {
      onChange([...value, ...files]);
    },
    onDropRejected: (rejections) => {
      onError(uniq(rejections.flatMap((r) => r.errors.flatMap(localizeDropzoneError))));
    },
    maxFiles,
    maxSize: 3 * 1024 * 1024,
    // validator: (file) => {
    //   if (file.size > 3 * 1024 * 1024) {
    //     return {
    //       code: "file-too-large",
    //       message: "Розмір файлу не повинен перевищувати 3MB",
    //     };
    //   }

    //   return null;
    // },
    disabled,
  });

  const handleDelete = (index: number) => {
    onChange(value.filter((_, i) => index !== i));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: cn(
            "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 focus-visible:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
            { "opacity-30": disabled },
            { "bg-blue-50": isDragActive },
          ),
        })}>
        <div className="text-center">
          {isDragActive ? (
            <ImageUp aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
          ) : (
            <Images aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
          )}
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              className={cn(
                "relative cursor-pointer rounded-md font-semibold text-orange-600 focus-within:outline-none focus-within:ring-1 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500",
                { "cursor-default": disabled },
              )}
              htmlFor="file-upload">
              <span>Завантажте файл</span>
              <input
                className="sr-only"
                disabled={disabled}
                id="file-upload"
                name="file-upload"
                type="file"
                {...getInputProps()}
              />
            </label>
            <p className="pl-1">або перетягніть його</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG до 3 МБ</p>
        </div>
      </div>

      {value.length > 0 && <Thumbnails files={value} onDelete={handleDelete} />}
    </div>
  );
}

function Thumbnails({
  files,
  onDelete,
}: {
  files: (File | Asset)[];
  onDelete: (index: number) => void;
}) {
  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li
          className="flex items-center justify-between space-x-4 rounded-lg border p-4 shadow-sm"
          key={file instanceof File ? file.name : file.id}>
          <div className="flex space-x-4">
            <div className="relative h-14 w-14">
              <Image
                alt={file instanceof File ? file.name : file.pathname}
                className="rounded-md object-cover"
                fill
                src={file instanceof File ? URL.createObjectURL(file) : file.url}
              />
            </div>

            <div className="space-y-">
              <p className="text-sm font-medium leading-none">
                {file instanceof File ? file.name : file.pathname}
              </p>
              <p className="text-sm text-zinc-500">{toHumanSize(file.size)}</p>
            </div>
          </div>

          <Button onClick={() => onDelete(index)} size="icon" type="button" variant="outline">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
