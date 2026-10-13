import { VerifyEmailDTO } from "../../dtos/auth/requestDTOs/VerifyEmailDTO";

export interface IVerifyEmailUseCase {
    execute (dto: VerifyEmailDTO): Promise<void>
}