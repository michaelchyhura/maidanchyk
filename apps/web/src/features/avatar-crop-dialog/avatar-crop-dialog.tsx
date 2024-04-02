import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Slider,
} from "@maidanchyk/ui";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { compress } from "../../shared/lib/files";

interface Props {
  open: boolean;
  filename: string;
  avatar: File;
  onSubmit: (file: File | Blob, url: string) => Promise<void>;
  onClose: () => void;
}

export function AvatarCropDialog({ open, filename, avatar, onSubmit, onClose }: Props) {
  const editor = useRef<AvatarEditor | null>(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setZoom(1);
  }, [open]);

  const handleSubmit = async () => {
    if (editor.current) {
      setLoading(true);

      // TODO: implement PICA compression
      const dataUrl = editor.current.getImage().toDataURL();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${filename}.jpg`, { type: "image/jpg" });

      await onSubmit(await compress(file), URL.createObjectURL(file));

      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Налаштуйте ваше фото</DialogTitle>
          <DialogDescription>
            Змінюйте розмір або вирівнюйте ваше фото, щоб воно виглядало так, як ви бажаєте
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center space-x-2">
          <div className="space-y-2 text-gray-500">
            <AvatarEditor
              border={50}
              borderRadius={125}
              className="mx-auto"
              color={[255, 255, 255, 0.6]} // RGBA
              height={250}
              image={avatar}
              ref={editor}
              rotate={0}
              scale={1 + zoom / 100}
              width={250}
            />

            <div className="flex items-center gap-x-4">
              <ZoomOut />
              <Slider
                max={100}
                min={1}
                onValueChange={(value) => setZoom(value[0])}
                step={1}
                value={[zoom]}
              />
              <ZoomIn />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-y-2 sm:justify-start">
          <Button disabled={loading} onClick={onClose} type="button" variant="secondary">
            Закрити
          </Button>
          <Button disabled={loading} onClick={handleSubmit} type="button">
            Зберегти зміни
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
