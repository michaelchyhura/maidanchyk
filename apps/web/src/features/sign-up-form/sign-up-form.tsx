import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  useToast,
} from "@maidanchyk/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { UserRole } from "@maidanchyk/prisma";
import { signUpSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

export const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: signUp } = trpc.auth.signUp.useMutation();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      await signUp(values);

      router.push("/auth/verify");
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again",
        description: (error as Error).message,
        variant: "destructive",
      });
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={UserRole.COURT_OWNER} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      I'm court owner - looking to host a court
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={UserRole.PLAYER} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      I'm player - looking for a court or a team
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          Sign Up
        </Button>
      </form>
    </Form>
  );
};
