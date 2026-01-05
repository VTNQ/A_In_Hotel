export type Gender = "0" | "1";
export const GENDER_OPTIONS: {
  value: Gender;
  labelKey: string;
}[] = [
  { value: "0", labelKey: "gender.male" },
  { value: "1", labelKey: "gender.female" },
];

export type SuperAdminForm={
    email:string;
    gender: Gender;
    fullName:string;
    phone:string;
    birthday?:Date;
    image:File | null
}