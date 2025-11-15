import { State } from "@/app/login/action";
import { SubmitButton } from "./SubmitButton";

export function RegisterForm({ action, state }: { action: (formData: FormData) => void, state: State }) {

  return (
    <form action={action} className="space-y-4">

      {/* Grupo 1: Credenciales */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700">Credenciales</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Correo Electrónico */}
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Correo Electrónico</label>
          <input type="email" name="email" required  defaultValue={state.values?.email} className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>

        {/* Contraseña (Simple) */}
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Contraseña</label>
          <input
            type="password"
            name="password"
            required
            defaultValue={state.values?.password}
            className={`w-full rounded-md px-3 py-2 text-sm bg-gray-200 border border-gray-300`}
          />

        </div>
      </div>

      {/* Grupo 2: Datos Personales */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700 mt-4">Datos Personales</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Nombre Completo</label>
          <input type="text" name="name" required defaultValue={state.values?.name} className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Número de Documento</label>
          <input type="text" name="id" required defaultValue={state.values?.id} className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Grupo 3: Contacto y Apartamento */}
      <h3 className="text-base font-semibold border-b pb-1 text-gray-700 mt-4">Ubicación y Contacto</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Contacto (Teléfono/Otro)</label>
          <input type="text" name="phone" required defaultValue={state.values?.phone} className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-700 block">Número de Apartamento</label>
          <input type="text" name="apartment" required defaultValue={state.values?.apartment}  className="bg-gray-200 w-full rounded-md px-3 py-2 text-sm" />
        </div>
      </div>

      {/* Botón de Envío */}
      <SubmitButton label="Registrarme" loadingLabel="Registrando..." bgColor="bg-red-primary hover:bg-red-700 cursor-pointer" />
    </form>
  );
}