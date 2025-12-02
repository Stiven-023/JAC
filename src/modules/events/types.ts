export type Event = {
    id: number,
    title: string;
    date: string;
    description: string
};

export interface ResponseEvents {
    data: Event[];
    totalPages: number;
}