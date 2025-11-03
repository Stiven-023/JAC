import ContactCard from "@/app/components/ContactCard";
import { GoLocation } from 'react-icons/go';
import { AiOutlineMail } from 'react-icons/ai';


export default function Page() {
    return (
        <div className="flex flex-row gap-4 justify-center items-center">
            <ContactCard icon={GoLocation} description={'Cra100 # 11-60'} />
            <ContactCard icon={AiOutlineMail} description={'info@jac.com'} />
            <ContactCard icon={GoLocation} description={'+57 324 7007 3282'} />

        </div>
    )
}