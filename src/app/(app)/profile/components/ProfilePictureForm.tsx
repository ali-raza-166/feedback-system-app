"use client";
import { ProfilePictureSchema } from "@/schemas/ProfilePictureFormSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePictureForm() {
  const [localImage, setLocalImage] = useState<string | null>(null); // State to hold uploaded image URL
  const toast = useToast();
  const form = useForm<z.infer<typeof ProfilePictureSchema>>({
    resolver: zodResolver(ProfilePictureSchema),
    defaultValues: {},
  });
  const watchProfilePicture = form.watch("profilePicture");

  // useEffect(() => {
  //   if (watchProfilePicture) {
  //     const imageUrl = URL.createObjectURL(watchProfilePicture);
  //     setLocalImage(imageUrl);
  //   } else {
  //     setLocalImage(null);
  //   }
  // }, [form.watch("profilePicture")]);

  const onSubmit = async (data: z.infer<typeof ProfilePictureSchema>) => {};

  return (
    <div className="flex items-center gap-6">
      <Avatar className="w-40 h-40">
        {localImage ? (
          <AvatarImage className="bg-secondary" src={localImage} alt="@shadcn" />
        ) : (
          <AvatarFallback>
            <img className="bg-secondary" src="/blank-profile.svg" alt="@shadcn" />
          </AvatarFallback>
        )}

        {/* <AvatarFallback>CN</AvatarFallback> */}
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
          <FormField
            name="profilePicture"
            control={form.control}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <Input
                  type="file"
                  {...fieldProps}
                  placeholder="Input"
                  accept="/image/*"
                  // className="hidden"
                  onChange={(e) => {
                    onChange(e.target.files && e.target.files[0]);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Upload</Button>
        </form>
      </Form>
    </div>
  );
}
