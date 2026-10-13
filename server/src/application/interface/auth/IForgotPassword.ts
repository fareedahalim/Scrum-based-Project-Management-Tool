import { ForgotPasswordDTO } from "../../dtos/auth/requestDTOs/ForgotPasswordDTO";

export interface IForgotPasswordUserUseCase{
  execute(dto: ForgotPasswordDTO): Promise<void>
}