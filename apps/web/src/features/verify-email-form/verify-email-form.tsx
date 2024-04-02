import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  useToast,
} from "@maidanchyk/ui";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { trpc } from "../../server/trpc";
import { verifyEmailSchema } from "./lib/validation";

export function VerifyEmailForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: verifyEmail } = trpc.auth.verifyEmail.useMutation();
  const { mutateAsync: sendVerificationEmail, isLoading } =
    trpc.auth.sendVerificationEmail.useMutation();

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof verifyEmailSchema>) => {
    try {
      await verifyEmail(values);

      toast({
        title: "Електронну пошту успішно підтверджено",
        description: "Ласкаво просимо до Майданчика! 👋",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Упс, щось трапилось...",
        description: "Будь ласка, спробуйте ще раз",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    try {
      await sendVerificationEmail();

      toast({
        title: "Лист з підтвердженням успішно надіслано",
        description: "Будь ласка, перевірте свою поштову скриньку та дотримуйтесь інструкцій",
      });
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код підтвердження</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Не отримали повідомлення?{" "}
                <button
                  className="text-sm font-semibold leading-6 text-orange-600 hover:text-orange-500 disabled:text-orange-300"
                  disabled={isLoading}
                  onClick={handleResend}
                  type="button">
                  Відправити ще раз
                </button>
              </FormDescription>
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
