import Hero from "@/components/hero";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex items-center justify-center gap-3 px-4">
        <a
          href="/products"
          className="bg-[#0900E9] text-white font-medium text-xl py-3 px-6 rounded hover:bg-[#0700b8] transition duration-200"
        >
          Predict a price
        </a>
      </main>
    </>
  );
}
