import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  error?: string;
  rules?: RegisterOptions;
  register: UseFormRegister<any>;
}

const Input = ({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
}: InputProps) => {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-1 text-red-500 px-2">{error}</p>}
    </div>
  );
};

export default Input;
