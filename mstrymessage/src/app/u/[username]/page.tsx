'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from '@ai-sdk/react'; // ✅ STILL CORRECT
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const SPECIAL_CHAR = '||'; // 🔁 renamed (clarity)

/* 🔁 safer parsing */
const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString
    .split(SPECIAL_CHAR)
    .map((m) => m.trim())
    .filter(Boolean);
};

/* ✅ unchanged */
const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  /* ✅ STILL VALID WITH NEW API */
  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages', // must return streamText response
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast(
        axiosError.response?.data?.message ??
          'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔁 simplified */
  const fetchSuggestedMessages = () => {
    complete('');
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !messageContent}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send It
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <Button
          onClick={fetchSuggestedMessages}
          disabled={isSuggestLoading}
        >
          {isSuggestLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Suggest Messages
        </Button>

        <p>Click on any message below to select it.</p>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {error && (
              <p className="text-red-500">{error.message}</p>
            )}

            {parseStringMessages(completion).map(
              (message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() =>
                    handleMessageClick(message)
                  }
                >
                  {message}
                </Button>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
