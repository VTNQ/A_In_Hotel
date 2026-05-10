export interface ChangePasswordProps {
    open:boolean;
    onClose:()=>void;
    onSubmit:()=>void;
}
export interface ChangePasswordForm {
    currentPassword:string;
    newPassword:string;
    confirmPassword:string;
}