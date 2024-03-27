import axios from "axios";
import { useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, useToast } from "@maidanchyk/ui";
import { upload } from "@vercel/blob/client";
import { useAuth } from "../../shared/providers/auth";
import { AvatarCropDialog } from "../avatar-crop-dialog";
import { useDropzone } from "react-dropzone";
import { useModal } from "../../shared/hooks/use-modal";
import { trpc } from "../../server/trpc";
import { uniq } from "../../shared/lib/arrays";

export const UserAvatarForm = () => {
  const { user, refetch } = useAuth();
  const { toast } = useToast();

  const { isOpen: cropDialogOpened, open: openCropDialog, close: closeCropDialog } = useModal();

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { mutateAsync: updateUser } = trpc.user.update.useMutation();

  const { open } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDropAccepted: (files) => {
      setAvatar(files[0]);
      setErrors([]);

      openCropDialog();
    },
    onDropRejected: (rejections) => {
      setErrors(uniq(rejections.flatMap((r) => r.errors.flatMap((e) => e.message))));
    },
    maxFiles: 1,
    validator: (file) => {
      if (file.size > 3 * 1024 * 1024) {
        return {
          code: "file-too-large",
          message: "File size should not be larger then 3MB",
        };
      }

      return null;
    },
  });

  const handleSubmit = async (file: File | Blob) => {
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
      });

      if (user?.photo) {
        await axios.delete(`/api/blob/delete?url=${user.photo}`);
      }

      await updateUser({ photo: blob.url });
      await refetch();

      toast({ title: "Profile photo successfully updated" });
      closeCropDialog();
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  const handleDeleteAvatar = async () => {
    setLoading(true);

    try {
      await axios.delete(`/api/blob/delete?url=${user?.photo}`);
      await updateUser({ photo: null });
      await refetch();

      toast({ title: "Profile photo successfully deleted" });
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <>
      <AvatarCropDialog
        open={cropDialogOpened}
        filename={`avatars/${user?.id}`}
        avatar={avatar!}
        onClose={closeCropDialog}
        onSubmit={handleSubmit}
      />

      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.photo || undefined} alt="" />
            <AvatarFallback>
              <User className="text-gray-400" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>

          <Button type="button" size="sm" variant="outline" onClick={open} disabled={loading}>
            Change
          </Button>

          {user?.photo && (
            <Button
              className="text-red-500 hover:bg-red-50 hover:text-red-500"
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleDeleteAvatar}
              disabled={loading}>
              Delete
            </Button>
          )}
        </div>

        {errors.map((error) => (
          <p key={error} className="text-sm font-medium text-red-500 dark:text-red-900">
            {error}
          </p>
        ))}
      </div>
    </>
  );
};
