export type Gender = "MALE" | "FEMALE";

export type SuperAdminForm={
    email:string;
    gender: Gender;
    fullName:string;
    phone:string;
    birthday?:Date;
    image:File | null
}