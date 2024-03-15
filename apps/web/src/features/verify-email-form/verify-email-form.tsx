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
                <InputOTP
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}{" "}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Didn't received any email?{" "}
                <button
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 disabled:text-indigo-300"
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

        <Button type="submit">Verify</Button>
      </form>
    </Form>
  );
};
