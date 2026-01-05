"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  // ✅ simulate loading (API / fetch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message — where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({delay: 2000, stopOnInteraction: false})]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {isLoading ? (
              <CarouselItem>
                <div className="flex flex-col space-y-3 p-1">
                  <Skeleton className="bg-gray-200 h-31.25 w-62.5 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="bg-gray-200 h-4 w-62.5" />
                    <Skeleton className="bg-gray-200 h-4 w-50" />
                  </div>
                </div>
              </CarouselItem>
            ) : (
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className="flex items-center justify-center">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <span className="text-lg font-semibold">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Carousel>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground">
        © 2026 Mystery Message. All rights reserved.
      </footer>
    </>
  )
}

export default Home
