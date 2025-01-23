import type {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  CancelBookingBodySchema,
  CancelBookingPathParamsSchema,
  Capability,
  CapabilityId,
  ConfirmBookingBodySchema,
  ConfirmBookingPathParamsSchema,
  Contact,
  CreateBookingBodySchema,
  CreateWebhookBodyParamsSchema,
  DeleteWebhookPathParamsSchema,
  ExtendBookingBodySchema,
  ExtendBookingPathParamsSchema,
  GetBookingPathParamsSchema,
  GetBookingsQueryParamsSchema,
  GetProductPathParamsSchema,
  Mapping,
  Order,
  Product,
  Supplier,
  UpdateBookingBodySchema,
  UpdateBookingPathParamsSchema,
  Webhook,
} from '@octocloud/types';
import {
  cancelBookingBodySchema,
  cancelBookingPathParamsSchema,
  confirmBookingBodySchema,
  confirmBookingPathParamsSchema,
  createBookingBodySchema,
  extendBookingBodySchema,
  extendBookingPathParamsSchema,
  getBookingPathParamsSchema,
  getBookingsQueryParamsSchema,
  updateBookingBodySchema,
  updateBookingPathParamsSchema,
} from '@octocloud/types';
import * as yup from 'yup';
import { RequestContext } from '../models/RequestContext';

export interface CoreParams {
  ctx: RequestContext;
}

export interface BackendParams extends CoreParams {
  locale?: string;
  capabilities?: CapabilityId[];
  useIdempotency?: boolean;
}

// deno-lint-ignore no-empty-interface
export interface GetBookingSchema extends GetBookingPathParamsSchema {}

export const getBookingSchema: yup.SchemaOf<GetBookingSchema> = getBookingPathParamsSchema.clone();

// deno-lint-ignore no-empty-interface
export interface GetBookingsSchema extends GetBookingsQueryParamsSchema {}

export const getBookingsSchema: yup.SchemaOf<GetBookingsSchema> = getBookingsQueryParamsSchema.clone();

// deno-lint-ignore no-empty-interface
export interface CreateBookingSchema extends CreateBookingBodySchema {}

export const createBookingSchema = createBookingBodySchema.clone();

export interface ConfirmBookingSchema extends ConfirmBookingPathParamsSchema, ConfirmBookingBodySchema {}

export const confirmBookingSchema: yup.SchemaOf<ConfirmBookingSchema> = yup.object().shape({
  ...confirmBookingPathParamsSchema.fields,
  ...confirmBookingBodySchema.fields,
});

export interface UpdateBookingSchema extends UpdateBookingBodySchema, UpdateBookingPathParamsSchema {}

export const updateBookingSchema: yup.SchemaOf<UpdateBookingSchema> = yup.object().shape({
  ...updateBookingPathParamsSchema.fields,
  ...updateBookingBodySchema.fields,
});

export interface CancelBookingSchema extends CancelBookingBodySchema, CancelBookingPathParamsSchema {}

export const cancelBookingSchema: yup.SchemaOf<CancelBookingSchema> = yup.object().shape({
  ...cancelBookingBodySchema.fields,
  ...cancelBookingPathParamsSchema.fields,
});

export interface ExtendBookingSchema extends ExtendBookingBodySchema, ExtendBookingPathParamsSchema {}

export const extendBookingSchema: yup.SchemaOf<ExtendBookingSchema> = yup.object().shape({
  ...extendBookingBodySchema.fields,
  ...extendBookingPathParamsSchema.fields,
});

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

export interface Backend {
  getProduct: (schema: GetProductPathParamsSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsPathParamsSchema, params: BackendParams) => Promise<Product[]>;
  getAvailability: (schema: AvailabilityBodySchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
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
