import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <section className="w-full h-full pt-44 items-center justify-center">
        <p className="text-gray-600 text-center">
          Run you agancy, in one place
        </p>

        <div className="bg-gradient-to-r text-center from-purple-500 to-pink-500  bg-clip-text text-transparent relative">
          <h1 className="font-bold text-9xl md:text-[200px]">Zenc</h1>
        </div>
        <div className="relative md:px-24 w-full flex justify-center items-center md:-translate-y-16">
          <Image
            className="rounded-xl border-x-4"
            width={1200}
            height={1200}
            alt="perview_image"
            src={"/assets/preview.png"}
          />
          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t dark:from-background  h-32"></div>
        </div>
        <div className="absolute -z-20 bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </section>
      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-center">
          Choose what fits you right
        </h2>
        <p className="text-center text-gray-500 mt-1 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
          harum rerum, illum quibusdam alias dignissimos temporibus. Sit
          deleniti earum voluptatibus.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-7">
          {pricingCards.map((cart) => {
            return (
              <Card
                className={clsx("flex-grow duration-500 hover:-translate-y-2 w-full sm:max-w-60", {
                  "border-2 border-blue-400": cart.title == "Unlimited Saas",
                })}
                key={cart.title}
              >
                <CardHeader>
                  <CardTitle>
                    <span
                      className={clsx("text-xl font-semibold", {
                        "text-muted-foreground": cart.title != "Unlimited Saas",
                      })}
                    >
                      {cart.title}
                    </span>
                  </CardTitle>
                  <CardDescription>{cart.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold">{cart.price}</span>
                  <span className="text-gray-400">/m</span>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <div>
                    {cart.features.map((feature) => {
                      return (
                        <div className="flex gap-1 text-sm" key={feature}>
                          <Check className="text-muted-foreground" />
                          <p className="text-sm">{feature}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex w-full mt-2">
                    <Link
                      className={clsx(
                        "bg-primary-foreground text-center w-full rounded-md p-2",
                        {
                          "bg-blue-500":
                            cart.title == "Unlimited Saas",
                        }
                      )}
                      href={`/agency?plan=${cart.priceId}`}
                    >
                      Get Started
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
