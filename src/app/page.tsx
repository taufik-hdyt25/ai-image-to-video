import Layout from "@/components/Layout";
import Home from "@/containers/Home/Home";
import { generateParams } from "@/helpers/generateParams";
import { IParams } from "@/interfaces/IBaseParams";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda - Aplikasi Saya",
};
const HomePage = async ({ searchParams, params }: IParams) => {
  const { query } = await generateParams({ searchParams, params });

  return (
    <Layout>
      <Home params={query} />
    </Layout>
  );
};

export default HomePage;
