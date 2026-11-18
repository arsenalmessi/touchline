
import type { WorkerProfile, Service } from "@prisma/client";

export type StepFormProps = {
  page: string;
  title: string;
  description: string;
  userId: string;
  nextPage: string;
  formId?: string;

  WorkerProfile?: (WorkerProfile & {
    services?: {
      serviceId: string;
      description?: string | null;
    }[];
  }) | null;

  services?: Service[];
};
