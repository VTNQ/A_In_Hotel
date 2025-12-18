export type BannerForm={
    title:string;
    startDate?:Date;
    endDate?:Date;
    cta:string;
    desc:string;
    bannerImage:File | null;
}