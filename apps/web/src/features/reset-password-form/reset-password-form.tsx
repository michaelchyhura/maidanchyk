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
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "../../server/trpc";
import { forgotPasswordSchema } from "./lib/validation";

export function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: resetPassword } = trpc.auth.resetPassword.useMutation();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await resetPassword({ token: router.query.token as string, password: values.password });

      toast({ title: "Новий пароль успішно збережено" });
      router.push("/");
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
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новий пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          Продовжити
        </Button>
      </form>
    </Form>
  );
}
