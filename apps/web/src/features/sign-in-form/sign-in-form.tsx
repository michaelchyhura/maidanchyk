import {
  Button,
  Form,
  FormControl,
  FormDescription,
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
import Link from "next/link";
import { useRouter } from "next/router";
import { signInSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

export const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: signIn } = trpc.auth.signIn.useMutation();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      await signIn(values);

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                <Link
                  href="/auth/forgot-password"
                  className="mt-2 text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Forgot Password?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          Sign In
        </Button>
      </form>
    </Form>
  );
};
