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
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../server/trpc";
import { signInSchema } from "./lib/validation";

export function SignInForm() {
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
    } catch {
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                <Link
                  className="mt-2 text-sm font-semibold leading-6 text-orange-600 hover:text-orange-500"
                  href="/auth/forgot-password">
                  Забули пароль?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
          Увійти
        </Button>
      </form>
    </Form>
  );
}
