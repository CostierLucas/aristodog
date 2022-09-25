import { NextPage } from "next";
import FormRaffle from "../../components/formRaffle/formRaffle";
import Header from "../../components/header/header";

const Create: NextPage = () => {
  return (
    <>
      <Header />
      <FormRaffle />
    </>
  );
};

export default Create;
