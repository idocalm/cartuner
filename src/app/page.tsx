import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
import ChartA from "./_components/charts/ChartA";

const Home = () => {
  return (
    <HydrateClient>
      <main className="flex min-h-screen w-screen flex-col pb-20 justify-center bg-background text-white">
        <div className="flex h-full w-full flex-col gap-4  px-10 pt-16 pb-50">
          <div className="flex flex-col gap-1">
            <h1 className="text-8xl font-extrabold tracking-tighter text-greenish">
              Making sure your car is <br />
              in good hands.
            </h1>
            <h2 className="text-2xl font-bold text-hint">
              Connecting you with the best mechanics near you
            </h2>
          </div>
          <div className="flex flex-row gap-4">
            <Button variant="default" size="lg">
              <Link href="/auth/client/signup">Let's get started</Link>
            </Button>
            <Button variant="secondary" size="lg">
              <Link href="/auth/mechanic/signup">I'm a mechanic</Link>
            </Button>
          </div>
          <br />
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">
              Why do I need{" "}
              <span className="text-greenish text-italic">cartuner</span>?
            </h1>
            <div className="w-20  h-[3px] bg-greenish my-2" />
            <p className="text-sm text-muted-foreground">
              We understand that finding a reliable mechanic can be a challenge.
              That's why we're here to connect you with the best mechanics near
              you.
            </p>

            <br />

            <ChartA />
          </div>

          <br />

          <div>
            <h1 className="text-4xl font-bold">FAQs</h1>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How much would I end up paying you?
                </AccordionTrigger>
                <AccordionContent>
                  We don't charge you as a customer at all. Our revenue comes
                  from the mechanics themselves
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How can I trust the mechanics you connect me with?
                </AccordionTrigger>
                <AccordionContent>
                  Our crew of mechanics are all vetted and regularly reviewed by
                  our team. We also have a rating system in place to ensure that
                  you're getting the best service possible. If you're not
                  satisfied with the service, we'll make sure to connect you
                  with another mechanic, and refund you the money you spent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How do I become a mechanic on your platform?
                </AccordionTrigger>
                <AccordionContent>
                  You can sign up as a mechanic on our platform by filling out
                  the form on our website. We'll get in touch with you shortly
                  after.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <br />

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">Contact us</h1>
            <p className="text-sm text-muted-foreground">
              Have any questions or concerns? Feel free to reach out to us at{" "}
              <a href="mailto:support@cartuner.com" className="text-primary">
                support@cartuner.com
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by{" "}
              <a href="https://github.com/idocalm" className="text-primary">
                @idocalm
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} cartuner. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
};

export default Home;
