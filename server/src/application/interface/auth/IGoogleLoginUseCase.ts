import { GoogleLoginDTO } from "../../dtos/auth/requestDTOs/GoogleLoginDTO";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";

export interface IGoogleLoginUseCase {
 

  
  execute(dto: GoogleLoginDTO): Promise<LoginResponseDTO>
}
