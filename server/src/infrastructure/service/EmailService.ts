import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import { OtpTemplate } from "../../shared/utils/OtpTemplate";
import { env } from "../../config/env";
import { InvitationTemplate } from "../../shared/utils/InvitationTemplate";

export class EmailService implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST,
        port: Number(env.EMAIL_PORT),
        secure: false,
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS?.replace(/\s+/g, ''),
        }   
      })
    }

    async sendOtp(email: string, otp: string): Promise<void> {
         const html = OtpTemplate.generate(otp)
        await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Verify Your Nexora Account",
      html
    });
        
         console.log(`OTP for ${email}: ${otp}`);
    }

    async sendInvitation(email: string, invitationLink: string): Promise<void> {
      
      const html = InvitationTemplate.generate(invitationLink);

      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: "You're Invited to join NEXORA",
        html,
      })
      console.log(`Invitation email send to ${email}`)
    }

 

}