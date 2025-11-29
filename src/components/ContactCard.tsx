import React from "react";

export default function ContactCard({ icon, description }: { icon: React.ElementType; description: string }) {
    return (
        <div className="flex flex-col justify-center items-center bg-[#D9D9D9] rounded-lg shadow-md space-y-2 w-40 h-35 ">
            {React.createElement(icon, { size: 50, color: 'red' })}
            <p className="flex flex-col p-1 text-center">{description}</p>
        </div>
    )
}