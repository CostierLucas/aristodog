import { NextPage } from "next";
import FormRaffle from "../../components/formRaffle/formRaffle";
import Header from "../../components/header/header";

const Create: NextPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h1 className="text-center text-white font-bold mt-7 text-5xl">
          CREATE NEW RAFFLE
        </h1>
        <FormRaffle />
      </div>
    </>
  );
};

export default Create;
