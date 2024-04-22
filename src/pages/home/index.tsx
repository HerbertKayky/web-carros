import Container from "../../components/container";
import { IoLocationOutline } from "react-icons/io5";

const Home = () => {
  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro"
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg hover:bg-red-600">
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        <section className="w-full bg-white rounded-lg">
          <img
            className="object-contain max-h-72 rounded-lg w-full hover:scale-105 transition-all"
            src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2024/202404/20240409/mitsubishi-lancer-2.0-16v-gasolina-4p-automatico-wmimagem12094240065.jpg?s=fill&w=1920&h=1440&q=75"
            alt="Carro"
          />
          <p className="font-bold mt-1 mb-2 px-2">Lancer Evolution</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">Ano 2017/2018 º 34000 km</span>
            <strong className="text-black font-medium text-xl">
              R$ 45.000
            </strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="px-2 pb-2 flex flex-row items-center">
            <span>
              <IoLocationOutline />
            </span>
            <span className="text-zinc-700 px-1 ">Toritama - PE</span>
          </div>
        </section>
      </main>
    </Container>
  );
};

export default Home;
