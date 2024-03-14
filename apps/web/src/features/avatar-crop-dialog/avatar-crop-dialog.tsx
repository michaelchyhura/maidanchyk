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
import { compress } from "../../shared/lib/images";

type Props = {
  open: boolean;
  filename: string;
  avatar: File;
  onSubmit: (file: File | Blob, url: string) => Promise<void>;
  onClose: () => void;
};

export const AvatarCropDialog = ({ open, filename, avatar, onSubmit, onClose }: Props) => {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tune Your Photo</DialogTitle>
          <DialogDescription>Customize your profile picture with precision</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center space-x-2">
          <div className="space-y-2 text-gray-500">
            <AvatarEditor
              ref={editor}
              className="mx-auto"
              image={avatar}
              width={250}
              height={250}
              borderRadius={125}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={1 + zoom / 100}
              rotate={0}
            />

            <div className="flex items-center gap-x-4">
              <ZoomOut />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                step={1}
                min={1}
                max={100}
              />
              <ZoomIn />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-y-2 sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
