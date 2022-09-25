import type { NextPage } from "next";
import Header from "../components/header/header";
import ListRaffle from "../components/listRaffle/listRaffle";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <ListRaffle />
    </>
  );
};

export default Home;
