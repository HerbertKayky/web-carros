import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import Container from "../../components/container";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { auth } from "../../services/firebaseConnection";
import { useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z
    .string()
    .min(1, "O campo senha é obrigatório")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const { handleInfoUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }
    handleLogout();
  }, []);

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });
        handleInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid
        })
        toast.success("Cadastro efetuado", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Erro ao cadastrar", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link className="mb-6 max-w-xs w-full" to="/">
          <img className="w-full" src={logoImg} alt="Logo do site" />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="h-10 font-medium text-white bg-zinc-900 w-full rounded-md hover:bg-zinc-700 transition-all"
          >
            Cadastrar
          </button>
        </form>
        <div>
          <span>
            Já possui uma conta?{" "}
            <Link className="font-medium" to="/login">
              Clique aqui{" "}
            </Link>
            para fazer o login
          </span>
        </div>
      </div>
    </Container>
  );
};

export default Register;
