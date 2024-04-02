import {
  Alert,
  AlertDescription,
  AlertTitle,
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
import { CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

export const ForgotPasswordForm = () => {
  const { toast } = useToast();

  const { mutateAsync: sendResetPasswordEmail } = trpc.auth.forgotPassword.useMutation();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await sendResetPasswordEmail(values);
    } catch {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  return form.formState.isSubmitSuccessful ? (
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Готово!</AlertTitle>
      <AlertDescription>
        Інструкції щодо відновлення вашого пароля були надіслані на{" "}
        <strong>{form.getValues().email}</strong>
      </AlertDescription>
    </Alert>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jon.doe@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Продовжити
        </Button>
      </form>
    </Form>
  );
};
