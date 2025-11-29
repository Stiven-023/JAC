import ContactCard from "@/components/ContactCard";
import { GoLocation } from 'react-icons/go';
import { AiOutlineMail } from 'react-icons/ai';


export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center h-[78vh]">
            <h1 className="text-lg font-semibold mb-6 md:text-xl lg:text-2xl">Contacto</h1>

            <div className="flex justify-center gap-8">
                <ContactCard icon={GoLocation} description={'Cra100 # 11-60'} />
                <ContactCard icon={AiOutlineMail} description={'info@jac.com'} />
                <ContactCard icon={GoLocation} description={'+57 324 7007 3282'} />

            </div>


        </div >

    )
}