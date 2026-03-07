const envServer = process.env.APPLICATIONS_SUBMISSION_ENABLED;
const envPublic = process.env.NEXT_PUBLIC_APPLICATIONS_SUBMISSION_ENABLED;
const TEMPORARILY_DISABLE_APPLICATIONS_SUBMISSION = true;

export const APPLICATIONS_SUBMISSION_ENABLED =
  !TEMPORARILY_DISABLE_APPLICATIONS_SUBMISSION &&
  envServer !== "false" &&
  envPublic !== "false";

export const APPLICATIONS_SUBMISSION_DISABLED_MESSAGE =
  process.env.NEXT_PUBLIC_APPLICATIONS_SUBMISSION_DISABLED_MESSAGE?.trim() ||
  "Идет обновление подачи заявок. Скоро все вернем.";
