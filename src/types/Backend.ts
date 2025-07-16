import {
  Availability,
  AvailabilityCalendar,
  AvailabilityCalendarBody,
  AvailabilityCheckBody,
  Booking,
  BookingCancellationBody,
  BookingCancellationRequest_uuid,
  BookingConfirmationBody,
  BookingConfirmationRequest_uuid,
  BookingReservationBody,
  BookingUpdateBody,
  BookingUpdateRequest_uuid,
  bookingCancellationBodySchema,
  bookingCancellationRequest_uuidSchema,
  bookingConfirmationBodySchema,
  bookingConfirmationRequest_uuidSchema,
  bookingReservationBodySchema,
  bookingUpdateBodySchema,
  bookingUpdateRequest_uuidSchema,
  Capability,
  CapabilityId,
  Contact,
  CreateWebhookBodyParamsSchema,
  DeleteWebhookPathParamsSchema,
  ExtendReservationBody,
  extendReservationBodySchema,
  GetBookingRequest_uuid,
  GetProductRequest_id,
  getBookingRequest_uuidSchema,
  getBookingsRequest_localDateEndSchema,
  getBookingsRequest_localDateSchema,
  getBookingsRequest_localDateStartSchema,
  getBookingsRequest_optionIdSchema,
  getBookingsRequest_productIdSchema,
  getBookingsRequest_resellerReferenceSchema,
  getBookingsRequest_supplierReferenceSchema,
  Mapping,
  Order,
  Product,
  RequestHeaders_octoCapabilities,
  RequestHeadersContent,
  requestHeaders_octoCapabilitiesSchema,
  requestHeadersContentSchema,
  Supplier,
  Webhook,
} from '@octocloud/types';
import * as z from 'zod';
import { RequestContext } from '../models/RequestContext';

export interface CoreParams {
  ctx: RequestContext;
}

export interface BackendParams extends CoreParams {
  locale?: string;
  capabilities?: CapabilityId[];
  useIdempotency?: boolean;
  useQueueOverflow?: boolean;
  useRawUnits?: boolean;
}

export type GetBookingSchema = {
  uuid: GetBookingRequest_uuid;
} & RequestHeaders_octoCapabilities &
  RequestHeadersContent;

export const getBookingSchema = z.object({
  uuid: getBookingRequest_uuidSchema,
  'octo-capabilities': requestHeaders_octoCapabilitiesSchema,
  'content-language': requestHeadersContentSchema.optional(),
});

export type GetBookingsSchema = {
  'octo-capabilities': z.infer<typeof requestHeaders_octoCapabilitiesSchema>;
  resellerReference?: z.infer<typeof getBookingsRequest_resellerReferenceSchema>;
  supplierReference?: z.infer<typeof getBookingsRequest_supplierReferenceSchema>;
  localDate?: z.infer<typeof getBookingsRequest_localDateSchema>;
  localDateStart?: z.infer<typeof getBookingsRequest_localDateStartSchema>;
  localDateEnd?: z.infer<typeof getBookingsRequest_localDateEndSchema>;
  productId?: z.infer<typeof getBookingsRequest_productIdSchema>;
  optionId?: z.infer<typeof getBookingsRequest_optionIdSchema>;
  'content-language'?: z.infer<typeof requestHeadersContentSchema>;
};

export const getBookingsSchema = z.object({
  'octo-capabilities': requestHeaders_octoCapabilitiesSchema,
  resellerReference: getBookingsRequest_resellerReferenceSchema.optional(),
  supplierReference: getBookingsRequest_supplierReferenceSchema.optional(),
  localDate: getBookingsRequest_localDateSchema.optional(),
  localDateStart: getBookingsRequest_localDateStartSchema.optional(),
  localDateEnd: getBookingsRequest_localDateEndSchema.optional(),
  productId: getBookingsRequest_productIdSchema.optional(),
  optionId: getBookingsRequest_optionIdSchema.optional(),
  'content-language': requestHeadersContentSchema.optional(),
});

export type CreateBookingSchema = BookingReservationBody & RequestHeaders_octoCapabilities & RequestHeadersContent;

export const createBookingSchema = bookingReservationBodySchema.merge(
  z.object({
    'octo-capabilities': requestHeaders_octoCapabilitiesSchema,
    'content-language': requestHeadersContentSchema,
  }),
);

export type ConfirmBookingSchema = BookingConfirmationBody & { uuid: BookingConfirmationRequest_uuid };

export const confirmBookingSchema = bookingConfirmationBodySchema.merge(
  z.object({
    bookingUuid: bookingConfirmationRequest_uuidSchema,
  }),
);

export type UpdateBookingSchema = BookingUpdateBody & { uuid: BookingUpdateRequest_uuid };

export const updateBookingSchema = bookingUpdateBodySchema.merge(
  z.object({
    bookingUuid: bookingUpdateRequest_uuidSchema,
  }),
);

export type CancelBookingSchema = BookingCancellationBody & { uuid: BookingCancellationRequest_uuid };

export const cancelBookingSchema = bookingCancellationBodySchema.merge(
  z.object({
    bookingUuid: bookingCancellationRequest_uuidSchema,
  }),
);

export type ExtendBookingSchema = ExtendReservationBody & RequestHeaders_octoCapabilities & RequestHeadersContent;

export const extendBookingSchema = extendReservationBodySchema.merge(
  z.object({
    'octo-capabilities': requestHeaders_octoCapabilitiesSchema,
    'content-language': requestHeadersContentSchema,
  }),
);

export enum LookupType {
  email = 'email',
  mobile = 'mobile',
  reference = 'reference',
}

export interface LookupSchema {
  email?: string;
  mobile?: string;
  reference?: string;
  verification?: string;
}

export interface CreateOrderSchema {
  expirationMinutes?: number;
  emailReceipt?: boolean;
  contact?: Contact;
  // octo/pricing
  currency?: string;
}

export interface GetMappingsSchema {
  productId?: string;
  optionId?: string;
  resellerReference?: string;
}

export type UpdateOrderSchema = CreateOrderSchema & {
  id: string;
};

export type ConfirmOrderSchema = CreateOrderSchema & {
  id: string;
};

export interface ExtendOrderSchema {
  id: string;
  expirationMinutes: number;
}

export interface CancelOrderSchema {
  id: string;
  reason?: string;
  force?: boolean;
}

export interface GetOrderSchema {
  id: string;
}

export type UpdateMappingsSchema = Mapping[];

export interface GetProductsPathParamsSchema {
  currency?: string;
}

export type GetProductPathParamsSchema = GetProductRequest_id & RequestHeaders_octoCapabilities & RequestHeadersContent;

export interface Backend {
  getProduct: (schema: GetProductPathParamsSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsPathParamsSchema, params: BackendParams) => Promise<Product[]>;
  getAvailability: (schema: AvailabilityCheckBody, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (schema: AvailabilityCalendarBody, params: BackendParams) => Promise<AvailabilityCalendar[]>;
  createBooking: (schema: CreateBookingSchema, params: BackendParams) => Promise<Booking>;
  updateBooking: (schema: UpdateBookingSchema, params: BackendParams) => Promise<Booking>;
  getBooking: (schema: GetBookingSchema, params: BackendParams) => Promise<Booking>;
  confirmBooking: (schema: ConfirmBookingSchema, params: BackendParams) => Promise<Booking>;
  cancelBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  deleteBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  extendBooking: (schema: ExtendBookingSchema, params: BackendParams) => Promise<Booking>;
  getBookings: (schema: GetBookingsSchema, params: BackendParams) => Promise<Booking[]>;
  getSupplier: (params: BackendParams) => Promise<Supplier>;
  getSuppliers: (params: BackendParams) => Promise<Supplier[]>;
  createWebhook: (schema: CreateWebhookBodyParamsSchema, params: BackendParams) => Promise<Webhook>;
  deleteWebhook: (schema: DeleteWebhookPathParamsSchema, params: BackendParams) => Promise<void>;
  listWebhooks: (schema: BackendParams) => Promise<Webhook[]>;
  updateMappings: (schema: UpdateMappingsSchema, params: BackendParams) => Promise<void>;
  getMappings: (schema: GetMappingsSchema, params: BackendParams) => Promise<Mapping[]>;
  createOrder: (schema: CreateOrderSchema, params: BackendParams) => Promise<Order>;
  updateOrder: (schema: UpdateOrderSchema, params: BackendParams) => Promise<Order>;
  getOrder: (schema: GetOrderSchema, params: BackendParams) => Promise<Order>;
  confirmOrder: (schema: ConfirmOrderSchema, params: BackendParams) => Promise<Order>;
  cancelOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  deleteOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  extendOrder: (schema: ExtendOrderSchema, params: BackendParams) => Promise<Order>;
  getGateway: (params: BackendParams) => Promise<unknown>;
  lookup: (schema: LookupSchema, params: BackendParams) => Promise<unknown>;
  getCapabilities: (params: BackendParams) => Promise<Capability[]>;
}
