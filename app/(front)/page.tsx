
import Head from "next/head";
import Hero from "@/components/frontend/Hero";

import Featured from "@/components/Home/Featured";

export default async function Home() {
  return (
    <>
      <Head>
        <title>
          Touchline
        </title>
        <meta
          name="description"
          content="Touchline connects care workers, and clients"
        />
        
      </Head>
      <section className="">
        <Hero />
        <Featured />
       
      </section>
    </>
  );
}
