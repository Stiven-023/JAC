import { State } from "@/app/login/action";
import { SubmitButton } from "./SubmitButton";


export function LoginForm({ action , state }: { action: (formData: FormData) => void , state:State}) {


  return (
    <form action={action} className="flex flex-col space-y-3">
      <label className="text-xs text-gray-700">Correo Electrónico</label>
      <input type="email" name="email" id="email" required defaultValue={state?.values?.email} className="bg-gray-200 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />

      <label className="text-xs text-gray-700">Contraseña</label>
      <input type="password" name="password" id="password" required  defaultValue={state?.values?.password} className="bg-gray-200 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />

      <SubmitButton label="Ingresar" loadingLabel="Verificando..." bgColor="bg-red-primary hover:bg-red-700 cursor-pointer" />
    </form>
  );
}