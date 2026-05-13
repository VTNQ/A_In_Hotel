export interface accountProfile {
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
}
export interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};