
export type NewTypes = {
    id: number,
    title: string;
    description: string;
    date: string
};

export type ResponseNews = {
    data: NewTypes[];
    totalPages: number;
}