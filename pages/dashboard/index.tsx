import { NextPage } from "next";
import Header from "../../components/header/header";
import MyRaffles from "../../components/myRaffles/myRaffles";
import Entries from "../../components/participations/entries";

const Dashboard: NextPage = () => {
  return (
    <>
      <Header />
      <MyRaffles />
      <Entries />
    </>
  );
};

export default Dashboard;
