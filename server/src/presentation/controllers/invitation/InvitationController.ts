import { inject, injectable } from "tsyringe";
import { ICreateInvitationUseCase } from "../../../application/interface/invitation/ICreateInvitationUseCase";
import { Request, Response } from "express";
import { CreateInvitationDTO } from "../../../application/dtos/invitation/requestDTOs/CreateInvitationDTO";
import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { INVITATION_ERRORS, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";
import { IAcceptInvitationUseCase } from "../../../application/interface/invitation/IAcceptInvitation";
import { AcceptInvitationDTO } from "../../../application/dtos/invitation/requestDTOs/AcceptInvitationDTO";
import { IGetInvitationsUseCase } from "../../../application/interface/invitation/IGetInvitations";
import { IResendInvitationUseCase } from "../../../application/interface/invitation/IResendInvitationUseCase";
import { ICancelInvitationUseCase } from "../../../application/interface/invitation/ICancelInvitationUseCase";

@injectable()
export class InvitationController {

  constructor(
    @inject('ICreateInvitationUseCase') private readonly _createInvitationUseCase: ICreateInvitationUseCase,
    @inject('IAcceptInvitationUseCase') private readonly _acceptInvitationUseCase: IAcceptInvitationUseCase,
    @inject('IGetInvitationsUseCase') private readonly _getInvitationsUseCase: IGetInvitationsUseCase,
    @inject('IResendInvitationUseCase') private readonly _resendInvitationUseCase: IResendInvitationUseCase,
    @inject('ICancelInvitationUseCase') private readonly _cancelInvitationUseCase: ICancelInvitationUseCase,
  ) { }

  createInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
    const dto: CreateInvitationDTO = {
      email: req.body.email
    }

    const adminId = req.user?.userId;

    if (!adminId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: USER_ERRORS.UNAUTHORIZED })
      return;
    }

    const result = await this._createInvitationUseCase.execute(dto, adminId);

    res.status(201).json({
      message: MESSAGES.INVITATION.INVITATION_CREATED_SUCCESSFULLY,
      data: result,
    });
  }

  acceptInvitation = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    console.log("the request body of accept invitation controller", req.body)
    const dto: AcceptInvitationDTO = {
      token: req.body.token,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };

    await this._acceptInvitationUseCase.execute(dto);

    res.status(200).json({
      message:
        INVITATION_ERRORS
          .INVITATION_ACCEPTED_SUCCESSFULLY,
    });
  };


  getInvitations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const rawStatus =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const validStatuses = [
      "PENDING",
      "ACCEPTED",
      "EXPIRED",
      "CANCELLED",
    ] as const;

    if (
      rawStatus &&
      !validStatuses.includes(
        rawStatus as (typeof validStatuses)[number]
      )
    ) {
      res.status(400).json({
        message: "Invalid invitation status",
      });
      return;
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        message: "Invalid page or limit",
      });
      return;
    }

    const result =
      await this._getInvitationsUseCase.execute({
        search,
        status: rawStatus
          ? rawStatus as (typeof validStatuses)[number]
          : undefined,
        page,
        limit,
      });

    res.status(200).json({
      message: "Invitations fetched successfully",
      data: result.invitations,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  };


  resendInvitation = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    const invitationId =
      req.params.id;

    await this._resendInvitationUseCase.execute(
      invitationId as string
    );

    res.status(200).json({
      message:
        "Invitation resent successfully",
    });
  };

  cancelInvitation = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    const invitationId =
      req.params.id;

    await this._cancelInvitationUseCase.execute(
      invitationId as string
    );

    res.status(200).json({
      message:
        "Invitation cancelled successfully",
    });
  };

}