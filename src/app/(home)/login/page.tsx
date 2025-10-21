import { redirect } from "next/navigation";

export default function Page() {
    async function handledLogin(data: FormData) {
        'use server';
        const email = data.get('email') as string;
        redirect('/home');
        console.log({ email });
    }
    return (
        <div className="flex flex-col items-start">
            <div>
                <h1 className="text-xl">Iniciar sesion</h1>
            </div>

            <form action={handledLogin} method="POST" className="flex flex-col space-y-1 mt-4">
                <label className="text-xs">Correo electronico</label>
                <input type="email" name="email" id="email" className="bg-[#D9D9D9] rounded-md px-2 py-1" />
                <label className="text-xs">Contraseña</label>
                <input type="password" name="password" id="password" className="bg-[#D9D9D9] rounded-md px-2 py-1 " />
                <label className="text-xs">Tipo de usuario</label>
                <select name="type" id="type" className="text-xs bg-[#D9D9D9] rounded-md px-2 py-1 " >
                    <option value="" className="text-xs">Selecciona el tipo de usuario</option>
                    <option value="residente" className="text-xs">Residente</option>
                    <option value="admin" className="text-xs">Administrador</option>
                </select>
                <button type="submit" className="bg-red-primary text-white rounded-sm px-2 py-1 mt-4">Ingresar</button>

            </form>


        </div>


    )
}   