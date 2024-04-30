import { FiTrash2 } from "react-icons/fi";
import Container from "../../components/container";
import DashboardHeader from "../../components/painelHeader";
import { useContext, useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../context/AuthContext";

interface CarProps {
  id: string;
  uid: string;
  name: string;
  price: string | number;
  year: string;
  city: string;
  km: string;
  images: ImageCarProps[];
}

interface ImageCarProps {
  name: string;
  id: string;
  url: string;
}

const Dashboard = () => {
  const [cars, setCars] = useState<CarProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) {
        return;
      }
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        let listcars = [] as CarProps[];

        snapshot.forEach((doc) => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listcars);
        console.log(listcars);
      });
    }
    loadCars();
  }, [user]);

  return (
    <Container>
      <DashboardHeader />

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="w-full bg-white rounded-lg relative">
          <button
            onClick={() => {}}
            className="absolute bg-white rounded-full h-9 w-9 flex items-center justify-center drop-shadow right-2 top-2"
          >
            <FiTrash2 size={24} color="#000" />
          </button>
          <img
            className="w-full rounded-lg mb-2 max-h-72"
            src="https://firebasestorage.googleapis.com/v0/b/webcarros-dd135.appspot.com/o/images%2FkHUtCkFwxSes0w4QwVIZXiVdQUE3%2F9889e18a-22c0-4a8a-be9d-1a2be61460c5?alt=media&token=d7224b6d-2a67-40df-8545-173db5c7799d"
            alt=""
          />
          <p className="font-bold mt-1 px-2 mb-2">Nissan Versa</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700">Ano 2016/2016 | 200.000 Km</span>
            <strong className="text-black font-bold mt-4">R$ 150.000</strong>
          </div>
          <div className="w-full h-px bg-slate-200 my-2"></div>
          <div className="px-2 pb-2">
            <span className="text-black">Toritama - PE</span>
          </div>
        </section>
      </main>
    </Container>
  );
};

export default Dashboard;
