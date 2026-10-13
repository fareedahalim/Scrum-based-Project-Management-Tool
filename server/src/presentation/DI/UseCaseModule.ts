import { container } from "tsyringe";
import { IRegisterUserCase } from "../../application/interface/auth/IRegisterUserUseCase";
import { RegisterUserUseCase } from "../../application/useCases/auth/RegisterUserUseCase";
import { ISendEmailOtpUseCase } from "../../application/interface/auth/ISendEmailOtpUseCase";
import { SendEmailOtpUseCase } from "../../application/useCases/auth/SendEmailOtpUseCase";
import { IVerifyEmailUseCase } from "../../application/interface/auth/IVerifyEmailUseCase";
import { VerifyEmailUseCase } from "../../application/useCases/auth/VerifyEmailUseCase";
import { IResendOtpUseCase } from "../../application/interface/auth/IResendOtpUseCase";
import { ResenedOtpUseCase } from "../../application/useCases/auth/ResendOtpUseCase";
import { ILoginUserUseCase } from "../../application/interface/auth/ILoginUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/auth/LoginUserUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../application/useCases/auth/RefreshTokenUseCase";
import { ILogoutUserUseCase } from "../../application/interface/auth/ILogoutUserUseCase";
import { LogoutUserUseCase } from "../../application/useCases/auth/LogoutUserUseCase";
import { ICreateOrganizationUseCase } from "../../application/interface/organization/ICreateOrganizationUseCase";
import { CreateOrganizationUseCase } from "../../application/useCases/organization/CreateOrganizationUseCase";
import { GetOrganizationUseCase } from "../../application/useCases/organization/GetOrganiationUseCase";
import { IGetOrganizationUseCase } from "../../application/interface/organization/IGetOrganizationUseCase";
import { IUpdateOrganizationUseCase } from "../../application/interface/organization/IUpdateOrganizationUseCase";
import { UpdateOrganizationUseCase } from "../../application/useCases/organization/UpdateOrganization";
import { IForgotPasswordUserUseCase } from "../../application/interface/auth/IForgotPassword";
import { ForgotPasswordUserUseCase } from "../../application/useCases/auth/ForgotPasswordUserUseCase";
import { IVerifyResetOtpUseCase } from "../../application/interface/auth/IVerifyResetOtpUseCase";
import { VerifyResetOtpUseCase } from "../../application/useCases/auth/VerifyResetOtpUseCase";
import { IResetPasswordUseCase } from "../../application/interface/auth/IResetPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/useCases/auth/ResetPasswordUseCase";
import { IGetUsersUseCase } from "../../application/interface/user/IGetUsersUseCase";
import { GetUsersUseCase } from "../../application/useCases/user/GetUsersUseCase";
import { IGetUserByIdUseCase } from "../../application/interface/user/IGetUserByIdUseCase";
import { GetUserByIdUseCase } from "../../application/useCases/user/GetUserByIdUseCase";
import { IUpdateUserUseCase } from "../../application/interface/user/IUpdateUserUseCase";
import { UpdatedUserUseCase } from "../../application/useCases/user/UpdateUserUseCase";
import { IActivateUserUseCase } from "../../application/interface/user/IActivateUserUseCase";
import { ActivateUserUseCase } from "../../application/useCases/user/ActivateUserUseCase";
import { IDeactivateUserUseCase } from "../../application/interface/user/IDeactivateUserUseCase";
import { DeactivateUserUseCase } from "../../application/useCases/user/DeactivateUserUseCase";
import { ICreateInvitationUseCase } from "../../application/interface/invitation/ICreateInvitationUseCase";
import { CreateInvitationUseCase } from "../../application/useCases/invitation/CreateInvitationUseCase";
import { IAcceptInvitationUseCase } from "../../application/interface/invitation/IAcceptInvitation";
import { AcceptInvitationUseCase } from "../../application/useCases/invitation/AcceptInvitationUseCase";
import { IGetInvitationsUseCase } from "../../application/interface/invitation/IGetInvitations";
import { GetInvitationsUseCase } from "../../application/useCases/invitation/GetInvitationUseCase";
import { IGoogleLoginUseCase } from "../../application/interface/auth/IGoogleLoginUseCase";
import { GoogleLoginUseCase } from "../../application/useCases/auth/GoogleLoginUseCase";
import { IResendInvitationUseCase } from "../../application/interface/invitation/IResendInvitationUseCase";
import { ResendInvitationUseCase } from "../../application/useCases/invitation/ResendInvitationUseCase";
import { ICancelInvitationUseCase } from "../../application/interface/invitation/ICancelInvitationUseCase";
import { CancelInvitationUseCase } from "../../application/useCases/invitation/CancelInvitationUseCase";
import { ICreateTeamUseCase } from "../../application/interface/team/ICreateTeamUseCase";
import { CreateTeamUseCase } from "../../application/useCases/team/CreateTeamUseCase";
import { IGetTeamByIdUseCase } from "../../application/interface/team/IGetTeamByIdUseCase";
import { GetTeamByIdUseCase } from "../../application/useCases/team/GetTeamByIdUseCase";
import { IGetTeamsUseCase } from "../../application/interface/team/IGetTeamsUseCase";
import { GetTeamsUseCase } from "../../application/useCases/team/GetTeamsUseCase";
import { IUpdateTeamUseCase } from "../../application/interface/team/IUpdateTeamUseCase";
import { UpdateTeamUseCase } from "../../application/useCases/team/UpdateTeamUseCase";
import { IAddTeamMemberUseCase } from "../../application/interface/team/IAddTeamMemberUseCase";
import { AddTeamMemberUseCase } from "../../application/useCases/team/AddTeamMemberUseCase";
import { IRemoveTeamMemberUseCase } from "../../application/interface/team/IRemoveTeamMemberUseCase";
import { RemoveTeamMemberUseCase } from "../../application/useCases/team/RemoveTeamMemberUseCase";
import { IChangeTeamLeadUseCase } from "../../application/interface/team/IChangeTeamLeadUseCase";
import { ChangeTeamLeadUseCase } from "../../application/useCases/team/ChangeTeamLeadUseCase";
import { IGetTeamMembersUseCase } from "../../application/interface/team/IGetTeamMembersUseCase";
import { GetTeamMembersUseCase } from "../../application/useCases/team/GetTeamMembersUseCase";
import { IGetAvailableTeamMembersUseCase } from "../../application/interface/team/IGetAvailableTeamMeamberUseCase";
import { GetAvailableTeamMembersUseCase } from "../../application/useCases/team/GetAvailableTeamMembersUseCase";
import { IDeleteTeamUseCase } from "../../application/interface/team/IDeleteTeamUseCase";
import { DeleteTeamUseCase } from "../../application/useCases/team/DeleteTeamUseCase";
import { IGetMyTeamUseCase } from "../../application/interface/team/IGetMyTeamUseCase";
import { GetMyTeamUseCase } from "../../application/useCases/team/GetMyTeamUseCase";

export class UseCaseModule {
    static registerModule(): void {

        container.register<IRegisterUserCase>('IRegisterUserUseCase', {
            useClass: RegisterUserUseCase
        })

        container.register<ISendEmailOtpUseCase>('ISendEmailOtpUseCase', {
            useClass: SendEmailOtpUseCase
        })

        container.register<IVerifyEmailUseCase>('IVerifyEmailUseCase', {
            useClass: VerifyEmailUseCase
        })

        container.register<IResendOtpUseCase>('IResendOtpUseCase', {
            useClass: ResenedOtpUseCase
        })

        container.register<ILoginUserUseCase>('ILoginUseCase', {
            useClass: LoginUserUseCase
        })

        container.register<IRefreshTokenUseCase>('IRefreshTokenUseCase', {
            useClass: RefreshTokenUseCase
        })

        container.register<ILogoutUserUseCase>('ILogoutUserUseCase', {
            useClass: LogoutUserUseCase
        })

        container.register<ICreateOrganizationUseCase>('ICreateOrganizationUseCase', {
            useClass: CreateOrganizationUseCase
        })

        container.register<IGetOrganizationUseCase>('IGetOrganizationUseCase', {
            useClass: GetOrganizationUseCase
        })

        container.register<IUpdateOrganizationUseCase>('IUpdateOrganizationUseCase',{
            useClass: UpdateOrganizationUseCase
        })

        container.register<IForgotPasswordUserUseCase>("IForgotPasswordUserUseCase",{
            useClass: ForgotPasswordUserUseCase
        })

        container.register<IVerifyResetOtpUseCase>("IVerifyResetOtpUseCase",{
            useClass: VerifyResetOtpUseCase

        })

        container.register<IResetPasswordUseCase>("IResetPasswordUseCase",{
            useClass: ResetPasswordUseCase

        })

        container.register<IGetUsersUseCase>("IGetUsersUseCase",{
            useClass: GetUsersUseCase

        })

        container.register<IGetUserByIdUseCase>("IGetUserByIdUseCase",{
            useClass: GetUserByIdUseCase

        })

        container.register<IUpdateUserUseCase>("IUpdateUserUseCase",{
            useClass: UpdatedUserUseCase

        })

        container.register<IActivateUserUseCase>("IActivateUserUseCase",{
            useClass: ActivateUserUseCase

        })
        container.register<IDeactivateUserUseCase>("IDeactivateUserUseCase",{
            useClass: DeactivateUserUseCase

        })
        container.register<ICreateInvitationUseCase>("ICreateInvitationUseCase",{
            useClass: CreateInvitationUseCase

        })

        container.register<IAcceptInvitationUseCase>("IAcceptInvitationUseCase",{
            useClass: AcceptInvitationUseCase

        })

        container.register<IGetInvitationsUseCase>("IGetInvitationsUseCase",{
            useClass: GetInvitationsUseCase

        })

        container.register<IGoogleLoginUseCase>("IGoogleLoginUseCase",{
            useClass: GoogleLoginUseCase

        })

        container.register<IResendInvitationUseCase>("IResendInvitationUseCase",{
            useClass: ResendInvitationUseCase

        })
        
        container.register<ICancelInvitationUseCase>("ICancelInvitationUseCase",{
            useClass: CancelInvitationUseCase

        })

        container.register<ICreateTeamUseCase>("ICreateTeamUseCase",{
            useClass: CreateTeamUseCase

        })

        container.register<IGetTeamByIdUseCase>("IGetTeamByIdUseCase",{
            useClass: GetTeamByIdUseCase

        })

        container.register<IGetTeamsUseCase>("IGetTeamsUseCase",{
            useClass: GetTeamsUseCase

        })

        container.register<IUpdateTeamUseCase>("IUpdateTeamUseCase",{
            useClass: UpdateTeamUseCase

        })

        container.register<IAddTeamMemberUseCase>("IAddTeamMemberUseCase",{
            useClass: AddTeamMemberUseCase

        })

        container.register<IRemoveTeamMemberUseCase>("IRemoveTeamMemberUseCase",{
            useClass: RemoveTeamMemberUseCase

        })

        container.register<IChangeTeamLeadUseCase>("IChangeTeamLeadUseCase",{
            useClass: ChangeTeamLeadUseCase

        })

        container.register<IGetTeamMembersUseCase>("IGetTeamMembersUseCase",{
            useClass: GetTeamMembersUseCase

        })

        container.register<IGetAvailableTeamMembersUseCase>("IGetAvailableTeamMembersUseCase",{
            useClass: GetAvailableTeamMembersUseCase

        })

        container.register<IDeleteTeamUseCase>("IDeleteTeamUseCase",{
            useClass: DeleteTeamUseCase

        })
        container.register<IGetMyTeamUseCase>("IGetMyTeamUseCase",{
            useClass: GetMyTeamUseCase

        })



    }
}