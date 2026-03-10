import { z } from 'zod';

export const equipmentSubmissionSchema = z.object({
  title: z.string().min(3),
  manufacturer: z.string().min(2),
  model: z.string().min(1),
  category: z.string().min(2),
  institutionId: z.string().min(1),
  countryId: z.string().min(1),
  description: z.string().min(20),
  contactPersonEmail: z.string().email()
});

export const bookingRequestSchema = z.object({
  equipmentId: z.string().min(1),
  institutionId: z.string().min(1),
  requestType: z.string().min(2),
  requestedStart: z.string().datetime(),
  requestedEnd: z.string().datetime(),
  purpose: z.string().min(10),
  projectTitle: z.string().optional(),
  notes: z.string().optional()
});

export const moderationDecisionSchema = z.object({
  entityType: z.enum(['equipment', 'researcher', 'funding', 'collaboration', 'institution']),
  entityId: z.string().min(1),
  status: z.enum(['APPROVED', 'REJECTED', 'NEEDS_CHANGES']),
  reviewerNotes: z.string().optional()
});
