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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { verifyEmailSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

export const VerifyEmailForm = () => {
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

      toast({ title: "Email verified successfully" });
      router.push("/");
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  const handleResend = async () => {
    try {
      await sendVerificationEmail();

      toast({
        title: "Verification email successfully sent",
        description: "Please check your inbox and follow the instructions",
      });
    } catch (error) {
      toast({ title: "Something went wrong. Please try again", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
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
                Didn't received any email?{" "}
                <button
                  className="text-sm font-semibold leading-6 text-orange-600 hover:text-orange-500 disabled:text-orange-300"
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}>
                  Send again
                </button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isLoading}>
          Verify
        </Button>
      </form>
    </Form>
  );
};
