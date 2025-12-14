export interface AboutHotelContentForm{
    id:string;
    description: string;
    ctaText: string;
    image?: File | null;
    imageUrl?: string;
    title:string;
}