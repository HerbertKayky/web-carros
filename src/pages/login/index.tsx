import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import Container from "../../components/container";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useEffect } from "react";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z.string().min(2, "O campo senha é obrigatório"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
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

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((user) => {
        toast.success("Login efetuado", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        console.log(user);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Erro ao logar", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        console.log("erro ao logar");
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
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="h-10 font-medium text-white bg-zinc-900 w-full rounded-md hover:bg-zinc-700 transition-all"
          >
            Acessar
          </button>
        </form>
        <div>
          <span>
            Ainda não possui uma conta?{" "}
            <Link className="font-medium" to="/register">
              Clique aqui{" "}
            </Link>
            para se cadastrar
          </span>
        </div>
      </div>
    </Container>
  );
};

export default Login;
