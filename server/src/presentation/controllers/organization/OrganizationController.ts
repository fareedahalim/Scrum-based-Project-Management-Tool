import { inject, injectable } from "tsyringe";
import { ICreateOrganizationUseCase } from "../../../application/interface/organization/ICreateOrganizationUseCase";
import { IGetOrganizationUseCase } from "../../../application/interface/organization/IGetOrganizationUseCase";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { ERROR_MESSAGES, ORGANIZATION_ERRORS } from "../../../domain/constants/errorMessages";
import { OrganizationDTO } from "../../../application/dtos/organization/requestDTOs/OrganizationDTO";
import { IUpdateOrganizationUseCase } from "../../../application/interface/organization/IUpdateOrganizationUseCase";

@injectable()
export class OrganizationController {

    constructor(
        @inject('ICreateOrganizationUseCase') private readonly _createOrganizationUseCase: ICreateOrganizationUseCase,
        @inject('IGetOrganizationUseCase') private readonly _getOrganizationUseCase: IGetOrganizationUseCase,
        @inject('IUpdateOrganizationUseCase') private readonly _updateOrganizationUseCase: IUpdateOrganizationUseCase,
    ) { }

    createOrganization = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('entering to organization  controller ')
            const dto: OrganizationDTO = {
                name: req.body.name,
                logo: req.body.logo,
                description: req.body.description,
                website: req.body.website
            }

            const response = await this._createOrganizationUseCase.execute(dto)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ORGANIZATION.ORGANIZATION_SETUP_COMPLETED, data: response })
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : ORGANIZATION_ERRORS.ORGANIZATION_CREATION_FAILED;

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    }


    getOrganization = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this._getOrganizationUseCase.execute();

            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: ORGANIZATION_ERRORS.ORGANIZATION_NOT_FOUND, data: null });
                return;
            }

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ORGANIZATION.ORGANIZATION_FETCHED_SUCCUSSFULLY, data: response })

        } catch (error) {
            const message = error instanceof Error ? error.message : ORGANIZATION_ERRORS.ORGANIZATION_FETCHED_FAILED;
            res.status(HTTP_STATUS.NOT_FOUND).json({ message })
        }

    }

    updateOrganization = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('entering to updated organization of organization  controller  ')
            const dto: OrganizationDTO = {
                name: req.body.name,
                logo: req.body.logo,
                description: req.body.description,
                website: req.body.website
            }

            const response = await this._updateOrganizationUseCase.execute(dto);

res.status(HTTP_STATUS.OK).json({
    message: MESSAGES.ORGANIZATION.ORGANIZATION_UPDATED_SUCCESSFULLY,
    data: response
});
        } catch (error) {
            const message = error instanceof Error ? error.message : ORGANIZATION_ERRORS.ORGANIZATION_UPDATION_FAILED;
            res.status(HTTP_STATUS.NOT_FOUND).json({ message })

        }

    }

}