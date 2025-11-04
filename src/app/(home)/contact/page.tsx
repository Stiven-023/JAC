import ContactCard from "@/app/components/ContactCard";
import { GoLocation } from 'react-icons/go';
import { AiOutlineMail } from 'react-icons/ai';


export default function Page() {
    return (
        <div className="flex flex-col items-center text-center px-4">
            <h1 className="text-lg font-semibold mb-6 md:text-xl lg:text-2xl">Contacto</h1>

            <div className="grid grid-cols-1 gap-6 w-full max-w-screen-sm
                            sm:grid-cols-2 sm:max-w-screen-md
                            lg:grid-cols-3 lg:gap-8 lg:max-w-screen-lg
                            ">
                <ContactCard icon={GoLocation} description={'Cra100 # 11-60'} />
                <ContactCard icon={AiOutlineMail} description={'info@jac.com'} />
                <ContactCard icon={GoLocation} description={'+57 324 7007 3282'} />

            </div>


        </div >

    )
}