export interface IEmailService {
    sendOtp(email: string,otp: string): Promise<void>;
    sendInvitation(email: string, invitationLink: string): Promise<void>
}