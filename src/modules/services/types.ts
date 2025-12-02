export type ServicioType = {
    id: number;
    title: string;
    shortDescription: string;
    fullDescription: string | null;
    isActive: boolean;
};

export type ResponseServicios = {
    data: ServicioType[];
    totalPages: number;
};
