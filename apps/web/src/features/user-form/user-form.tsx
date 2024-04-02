import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@maidanchyk/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "./lib/validation";
import { useAuth } from "../../shared/providers/auth";
import { trpc } from "../../server/trpc";

export const UserForm = () => {
  const { user, refetch } = useAuth();
  const { toast } = useToast();

  const { mutateAsync: updateUser } = trpc.user.update.useMutation();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      telegram: user?.telegram || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      await updateUser({
        name: values.name || null,
        phone: values.phone || null,
        telegram: values.telegram || null,
      });
      await refetch();

      toast({ title: "Профіль успішно оновлено" });
    } catch (error) {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ім'я та прізвище</FormLabel>
              <FormControl>
                <Input placeholder="Jon Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2 ">
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram</FormLabel>
                <FormControl>
                  <Input placeholder="https://t.me/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="+380123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Зберегти зміни
        </Button>
      </form>
    </Form>
  );
};
