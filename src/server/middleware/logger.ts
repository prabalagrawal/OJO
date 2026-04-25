import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/middleware.ts";
import { db } from "../../lib/firebase-admin.ts";
import { FieldValue } from "firebase-admin/firestore";

export async function logActivity(req: AuthRequest, event: string, details: string) {
  try {
    await db.collection("activity_logs").add({
      event,
      userId: req.user?.id || "anonymous",
      details,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Activity Logging Error:", error);
  }
}

export const activityLogger = (event: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // We log after the request is processed or based on specific events
    // For now, we'll log it manually in the routers for better context
    next();
  };
};
