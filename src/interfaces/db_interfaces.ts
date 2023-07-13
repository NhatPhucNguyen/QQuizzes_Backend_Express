export interface IUser {
    username: string;
    password: string;
    email: string;
    purpose: string;
    fullName: string;
    educationInstitution?: string;
    job?: string;
    role: string;
}
