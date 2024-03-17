import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Images, Trash2 } from "lucide-react";
import { Button, cn } from "@maidanchyk/ui";
import { uniq } from "../../shared/lib/arrays";
import { toHumanSize } from "../../shared/lib/files";

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
  onError: (errors: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
};

export const Dropzone = ({ value, onChange, onError, maxFiles = 1, disabled }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDropAccepted: async (files) => {
      onChange([...value, ...files]);
    },
    onDropRejected: (rejections) => {
      onError(uniq(rejections.flatMap((r) => r.errors.flatMap((e) => e.message))));
    },
    maxFiles,
    validator: (file) => {
      if (file.size > 3 * 1024 * 1024) {
        return {
          code: "file-too-large",
          message: "File size should not be larger then 3MB",
        };
      }

      return null;
    },
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
            "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10",
            { "opacity-30": disabled },
          ),
        })}>
        <div className="text-center">
          <Images className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className={cn(
                "relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500",
                { "cursor-default": disabled },
              )}>
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                {...getInputProps()}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG up to 3MB</p>
        </div>
      </div>

      {value.length > 0 && <Thumbnails files={value} onDelete={handleDelete} />}
    </div>
  );
};

const Thumbnails = ({ files, onDelete }: { files: File[]; onDelete: (index: number) => void }) => {
  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li
          key={file.name}
          className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex space-x-4">
            <div className="relative h-14 w-14">
              <Image
                className="rounded-md object-cover"
                src={URL.createObjectURL(file)}
                alt="Photo by Drew Beamer"
                fill
              />
            </div>

            <div className="space-y-">
              <p className="text-sm font-medium leading-none">{file.name}</p>
              <p className="text-sm text-zinc-500">{toHumanSize(file.size)}</p>
            </div>
          </div>

          <Button type="button" variant="outline" size="icon" onClick={() => onDelete(index)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </li>
      ))}
    </ul>
  );
};