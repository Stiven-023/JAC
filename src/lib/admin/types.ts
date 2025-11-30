
export type CrudResult<T = unknown> = { 
    success: boolean; 
    message?: string; 
    data?: T | null; 
};