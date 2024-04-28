import { FiTrash, FiUpload } from "react-icons/fi";
import Container from "../../../components/container";
import DashboardHeader from "../../../components/painelHeader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year: z.string().min(1, "O ano do carro é obrigatório"),
  km: z.string().min(1, "O km do carro é obrigatório"),
  price: z.string().min(1, "O preço é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  whatsapp: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Número de telefone inválido",
    }),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

const New = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem .jpeg ou .png");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    if (carImages.length === 0) {
      alert("Envia alguma imagem deste carro");
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, "cars"), {
      name: data.name,
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      km: data.km,
      price: data.price,
      description: data.description,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        toast.success("Carro cadastrado!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        reset();
        setCarImages([]);
      })
      .catch((error) => {
        console.log(error);
        console.log("erro ao cadastrar no banco");
      });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch (err) {
      console.log("Erro ao deletar");
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              className="opacity-0 cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            className="w-full h-32 flex items-center justify-center relative"
            key={item.name}
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              className="w-full h-32 rounded-lg object-cover"
              src={item.previewUrl}
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Ônix 1.0..."
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex Manual"
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2017/2017"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 24.820"
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone/WhatsApp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 81993396908"
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Toritama"
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: R$70.000"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10 hover:bg-zinc-800 transition-all"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
};

export default New;
