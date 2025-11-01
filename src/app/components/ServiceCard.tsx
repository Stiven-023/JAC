import React from "react";

export default function ServiceCard({ icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div>
            <div>
                {React.createElement(icon, { size: 50 })}

            </div>
            <div>

            </div>

        </div>

    );
}
