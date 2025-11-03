import React from "react";

export default function ServiceCard({ icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="flex flex-col p-1  bg-[#D9D9D9] rounded-lg shadow-md space-y-2 w-60">
            <div className="flex flex-row justify-between space-x-2 items-center">

                {React.createElement(icon, { size: 50 })}
                <h2 className="font-bold whitespace-pre-line ">{title}</h2>

            </div>
            <div>
                <p className="flex flex-col p-1">{description}</p>
            </div>
            <div className="w-full">
                <p className="flex justify-end" >Leer mas...</p>
            </div>
        </div>

    );
}
