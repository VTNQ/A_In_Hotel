export type Gender = "0" | "1";
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "0", label: "Nam" },
  { value: "1", label: "Nữ" },
];

export type SuperAdminForm={
    email:string;
    gender: Gender;
    fullName:string;
    phone:string;
    birthday?:Date;
    image:File | null
}