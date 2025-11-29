import React from "react";

export default function ServiceCard({
    icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="flex h-full flex-col bg-[#D9D9D9] p-4 rounded-lg shadow-md space-y-3">
            <div className="flex items-center space-x-3">
                <div className="text-3xl text-gray-700">
                    {React.createElement(icon, { size: 32 })}
                </div>
                <h2 className="font-bold">{title}</h2>
            </div>
            <p>{description}</p>
            <div className="flex justify-end">
                <span className="hover:underline">Leer mas</span>
            </div>
        </div>
    );
}
