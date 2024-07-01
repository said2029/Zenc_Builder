import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <section className="w-full h-full pt-44 items-center justify-center">
        <p className="text-gray-600 text-center">Run you agancy, in one place</p>

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
        <h2 className="text-3xl">Choose what fits you right</h2>
      </section>
    </main>
  );
}
