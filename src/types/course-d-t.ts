export type ICourseDT = {
    id: number;
    title: string;
    author_img?: string;
    author_name: string;
    thumbnail: string;
    category: string;
    price: number;
    avg_rating: number;
    discount: number;
    lessons: number;
    students: number;
    total_rating: number;
    language: string;
    progress?: number;
}