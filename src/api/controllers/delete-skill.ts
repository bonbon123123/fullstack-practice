import { Request, Response } from "express";
import { AppServices } from "app/app-services";
import { HttpErrorResponse } from "app/utils/errors";

export const deleteSkillController = (app: AppServices) => {
  return async (req: Request, res: Response) => {
    const skillIdParam = req.params.skillId;

    // Validate param exists and is digits only
    if (typeof skillIdParam !== "string" || !skillIdParam.trim() || !/^\d+$/.test(skillIdParam)) {
      throw new HttpErrorResponse(400, { message: "Invalid skill ID" });
    }


    const skillId = Number(skillIdParam);

    if (!Number.isSafeInteger(skillId) || skillId <= 0) {
      throw new HttpErrorResponse(400, { message: "Invalid skill ID" });
    }

    try {
      const deleted = await app.storages.skillsStorage.delete(skillId);

      if (!deleted) {
        throw new HttpErrorResponse(404, { message: "Skill not found" });
      }
    } catch {
      throw new HttpErrorResponse(404, { message: "Skill not found" });
    }

    return res.status(204).send();
  };
};
