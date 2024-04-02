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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { newsletterSchema } from "./lib/validation";
import { trpc } from "../../server/trpc";

type Props = {
  className?: string;
};

export const NewsletterForm = ({ className }: Props) => {
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
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("mx-auto max-w-md space-y-4", className)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  className="bg-white"
                  placeholder="jon.doe@gmail.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full sm:w-auto" type="submit" disabled={form.formState.isSubmitting}>
          Сповістити мене
        </Button>
      </form>
    </Form>
  );
};
