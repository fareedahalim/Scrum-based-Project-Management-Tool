
import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";

import { ICreateOrganizationUseCase } from "../../../application/interface/organization/ICreateOrganizationUseCase";
import { IGetOrganizationUseCase } from "../../../application/interface/organization/IGetOrganizationUseCase";
import { IUpdateOrganizationUseCase } from "../../../application/interface/organization/IUpdateOrganizationUseCase";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { ORGANIZATION_ERRORS } from "../../../domain/constants/errorMessages";

import { OrganizationDTO } from "../../../application/dtos/organization/requestDTOs/OrganizationDTO";
import logger from "../../../config/logger";

@injectable()
export class OrganizationController {
    constructor(
        @inject("ICreateOrganizationUseCase")
        private readonly _createOrganizationUseCase: ICreateOrganizationUseCase,

        @inject("IGetOrganizationUseCase")
        private readonly _getOrganizationUseCase: IGetOrganizationUseCase,

        @inject("IUpdateOrganizationUseCase")
        private readonly _updateOrganizationUseCase: IUpdateOrganizationUseCase
    ) {}

    createOrganization = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: OrganizationDTO = {
                name: req.body.name,
                logo: req.body.logo,
                description: req.body.description,
                website: req.body.website,
            };

            const response =
                await this._createOrganizationUseCase.execute(dto);

            logger.info("Organization created successfully");

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.ORGANIZATION.ORGANIZATION_SETUP_COMPLETED,
                data: response,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ORGANIZATION_ERRORS.ORGANIZATION_CREATION_FAILED;

            logger.error("Failed to create organization", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    getOrganization = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const response =
                await this._getOrganizationUseCase.execute();

            if (!response) {
                logger.warn("Organization not found");

                res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: ORGANIZATION_ERRORS.ORGANIZATION_NOT_FOUND,
                    data: null,
                });
                return;
            }

            logger.info("Organization fetched successfully");

            res.status(HTTP_STATUS.OK).json({
                message:
                    MESSAGES.ORGANIZATION.ORGANIZATION_FETCHED_SUCCUSSFULLY,
                data: response,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ORGANIZATION_ERRORS.ORGANIZATION_FETCHED_FAILED;

            logger.error("Failed to fetch organization", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    updateOrganization = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: OrganizationDTO = {
                name: req.body.name,
                logo: req.body.logo,
                description: req.body.description,
                website: req.body.website,
            };

            const response =
                await this._updateOrganizationUseCase.execute(dto);

            logger.info("Organization updated successfully");

            res.status(HTTP_STATUS.OK).json({
                message:
                    MESSAGES.ORGANIZATION.ORGANIZATION_UPDATED_SUCCESSFULLY,
                data: response,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ORGANIZATION_ERRORS.ORGANIZATION_UPDATION_FAILED;

            logger.error("Failed to update organization", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };
}
