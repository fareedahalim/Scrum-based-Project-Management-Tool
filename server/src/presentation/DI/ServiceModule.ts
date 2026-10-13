import { container } from "tsyringe";
import { IPasswordService } from "../../domain/interfaces/services/IPasswordService";
import { PasswordService } from "../../infrastructure/service/PasswordService";
import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import { EmailService } from "../../infrastructure/service/EmailService";
import { ITempUserStore } from "../../domain/interfaces/services/ITempUserStore";
import { RedisTempUserStore } from "../../infrastructure/service/RedisTempUserStore";
import { IJwtService } from "../../domain/interfaces/services/IJwtService";
import { JwtService } from "../../infrastructure/service/JwtService";
import { IGoogleAuthService } from "../../domain/interfaces/services/IGoogleAuthService";
import { GoogleAuthService } from "../../infrastructure/service/GoogleAuthService";

export class ServiceModule {
    static registerModule(): void {

        container.register<IPasswordService>('IPasswordService',{
            useClass: PasswordService
        })

        container.register<IEmailService>('IEmailService',{
            useClass: EmailService
        })

        container.register<ITempUserStore>("ITempUserStore",{
            useClass: RedisTempUserStore
        })

        container.register<IJwtService>('IJwtService', {
            useClass: JwtService
        })

         container.register<IGoogleAuthService>('IGoogleAuthService',{
            useClass:  GoogleAuthService
        })



    }
}