import axios from "axios";
import { useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Button, useToast } from "@maidanchyk/ui";
import { upload } from "@vercel/blob/client";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../shared/providers/auth";
import { AvatarCropDialog } from "../avatar-crop-dialog";
import { useModal } from "../../shared/hooks/use-modal";
import { trpc } from "../../server/trpc";
import { uniq } from "../../shared/lib/arrays";

export function UserAvatarForm() {
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
    multiple: false,
    validator: (file) => {
      if (file.size > 3 * 1024 * 1024) {
        return {
          code: "file-too-large",
          message: "Розмір файлу не повинен перевищувати 3MB",
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

      toast({ title: "Фото профілю успішно оновлено" });
      closeCropDialog();
    } catch (error) {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.photo) {
      return;
    }

    setLoading(true);

    try {
      await axios.delete(`/api/blob/delete?url=${user.photo}`);
      await updateUser({ photo: null });
      await refetch();

      toast({ title: "Фото профілю успішно видалено" });
    } catch (error) {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <AvatarCropDialog
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        avatar={avatar!}
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        filename={`avatars/${user?.id}`}
        onClose={closeCropDialog}
        onSubmit={handleSubmit}
        open={cropDialogOpened}
      />

      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage alt="" src={user?.photo || undefined} />
            <AvatarFallback>
              <User aria-hidden="true" className="text-gray-400" />
            </AvatarFallback>
          </Avatar>

          <Button disabled={loading} onClick={open} size="sm" type="button" variant="outline">
            Змінити
          </Button>

          {user?.photo ? (
            <Button
              className="text-red-500 hover:bg-red-50 hover:text-red-500"
              disabled={loading}
              onClick={handleDeleteAvatar}
              size="sm"
              type="button"
              variant="ghost">
              Видалити
            </Button>
          ) : null}
        </div>

        {errors.map((error) => (
          <p className="text-sm font-medium text-red-500 dark:text-red-900" key={error}>
            {error}
          </p>
        ))}
      </div>
    </>
  );
}
