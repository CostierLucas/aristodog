import { NextPage } from "next";
import Header from "../../components/header/header";
import MyRaffles from "../../components/myRaffles/myRaffles";
import SectionRaffle from "../../components/sectionRaffle/sectionRaffle";

const MyRafflePage: NextPage = () => {
  return (
    <>
      <Header />
      <MyRaffles />
    </>
  );
};

export default MyRafflePage;
