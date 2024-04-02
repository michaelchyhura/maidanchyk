import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  cn,
  useToast,
} from "@maidanchyk/ui";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "../../server/trpc";
import { newsletterSchema } from "./lib/validation";

interface Props {
  className?: string;
}

export function NewsletterForm({ className }: Props) {
  const { toast } = useToast();

  const { mutateAsync: subscribe } = trpc.newsletter.subscribe.useMutation();

  const form = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newsletterSchema>) => {
    try {
      await subscribe(values);

      toast({ title: "Ви будете першими, хто дізнається про наш запуск. Дякуємо!" });
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
      <form
        className={cn("mx-auto max-w-md space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  className="bg-white"
                  placeholder="jon.doe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
          Сповістити мене
        </Button>
      </form>
    </Form>
  );
}
