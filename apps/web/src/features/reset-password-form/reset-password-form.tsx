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
import { useRouter } from "next/router";
import { forgotPasswordSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

export const ResetPasswordForm = () => {
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

      toast({ title: "Password changed successfully" });
      router.push("/");
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
};
