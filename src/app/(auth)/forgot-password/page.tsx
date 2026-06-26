"use client";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { emailSchema } from "@/schemas/emailSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
export default function ForgotPassword() {
  const [successFlag, setSuccessFlag] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    try {
      data.email = data.email.toLowerCase();
      const response = await axios.post<ApiResponse>("/api/forgot-password", data);
      console.log({ response: response.data });
      setSuccessFlag(true);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      // console.error("Error during sign-up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem while recovering your password. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl md:text-2xl mb-6">
            Recover Password
          </h1>
          <p className="mb-4">
            You will recieve a passowrd recovery email containing the password reset url
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            method="POST"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="abc@example.com" {...field} name="email" />
                  {successFlag ? (
                    <p className="text-muted text-gray-500 text-sm">
                      <span className="text-green-500">Success!</span> Please check your
                      email!
                    </p>
                  ) : (
                    <p className="text-muted text-gray-500 text-sm">
                      We will send you a verification code
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Recover"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
