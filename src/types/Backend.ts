import { BaseConnection } from './Connection';
import { RequestDataManager } from '../models/RequestDataManager';
import type {
  CapabilityId,
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  CancelBookingBodySchema,
  CancelBookingPathParamsSchema,
  Capability,
  ConfirmBookingBodySchema,
  ConfirmBookingPathParamsSchema,
  Contact,
  CreateBookingBodySchema,
  ExtendBookingBodySchema,
  ExtendBookingPathParamsSchema,
  GetBookingPathParamsSchema,
  GetBookingsQueryParamsSchema,
  GetProductPathParamsSchema,
  Mapping,
  Product,
  Supplier,
  UpdateBookingBodySchema,
  UpdateBookingPathParamsSchema,
} from "@octocloud/types";
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
} from "@octocloud/types";
import { Config } from '../models/Config';
import * as yup from "yup";

export interface BackendParams {
  locale?: string;
  rdm: RequestDataManager<BaseConnection, Config>;
  capabilities?: CapabilityId[];
  useIdempotency?: boolean;
};

// deno-lint-ignore no-empty-interface
export interface GetBookingSchema extends GetBookingPathParamsSchema {}

export const getBookingSchema: yup.SchemaOf<GetBookingSchema> =
  getBookingPathParamsSchema.clone();

// deno-lint-ignore no-empty-interface
export interface GetBookingsSchema extends GetBookingsQueryParamsSchema {}

export const getBookingsSchema: yup.SchemaOf<GetBookingsSchema> =
  getBookingsQueryParamsSchema.clone();

// deno-lint-ignore no-empty-interface
export interface CreateBookingSchema extends CreateBookingBodySchema {}

export const createBookingSchema = createBookingBodySchema.clone();

export interface ConfirmBookingSchema
  extends ConfirmBookingPathParamsSchema, ConfirmBookingBodySchema {}

export const confirmBookingSchema: yup.SchemaOf<ConfirmBookingSchema> = yup
  .object()
  .shape({
    ...confirmBookingPathParamsSchema.fields,
    ...confirmBookingBodySchema.fields,
  });

export interface UpdateBookingSchema
  extends UpdateBookingBodySchema, UpdateBookingPathParamsSchema {}

export const updateBookingSchema: yup.SchemaOf<UpdateBookingSchema> = yup
  .object()
  .shape({
    ...updateBookingPathParamsSchema.fields,
    ...updateBookingBodySchema.fields,
  });

export interface CancelBookingSchema
  extends CancelBookingBodySchema, CancelBookingPathParamsSchema {}

export const cancelBookingSchema: yup.SchemaOf<CancelBookingSchema> = yup
  .object()
  .shape({
    ...cancelBookingBodySchema.fields,
    ...cancelBookingPathParamsSchema.fields,
  });

export interface ExtendBookingSchema
  extends ExtendBookingBodySchema, ExtendBookingPathParamsSchema {}

export const extendBookingSchema: yup.SchemaOf<ExtendBookingSchema> = yup
  .object()
  .shape({
    ...extendBookingBodySchema.fields,
    ...extendBookingPathParamsSchema.fields,
  });

export enum WebhookEvent {
  BookingUpdate = "booking_update",
  AvailabilityUpdate = "availability_update",
}

export type Webhook = {
  id: string;
  event: WebhookEvent;
  url: string;
};

export type CreateWebhookSchema = {
  url: string;
  event: WebhookEvent;
  retry_on_error?: boolean;
};

export type DeleteWebhookSchema = {
  id: string;
};

export enum LookupType {
  email = "email",
  mobile = "mobile",
  reference = "reference",
}

export type LookupSchema = {
  email?: string;
  mobile?: string;
  reference?: string;
  verification?: string;
};

export type CreateOrderSchema = {
  expirationMinutes?: number;
  emailReceipt?: boolean;
  contact?: Contact;
  // octo/pricing
  currency?: string;
};

export type UpdateOrderSchema = CreateOrderSchema & {
  id: string;
};

export type ConfirmOrderSchema = CreateOrderSchema & {
  id: string;
};

export type ExtendOrderSchema = {
  id: string;
  expirationMinutes: number;
};

export type CancelOrderSchema = {
  id: string;
  reason?: string;
};

export type GetOrderSchema = {
  id: string;
};

export type UpdateMappingsSchema = Array<Mapping>;

export interface GetProductsPathParamsSchema {
  currency?: string;
}

export interface Backend {
  getProduct(
    data: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product>;
  getProducts(
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Product[]>;
  getAvailability(
    data: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Availability[]>;
  getAvailabilityCalendar(
    data: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]>;
  createBooking(data: CreateBookingSchema, params: BackendParams): Promise<Booking>;
  updateBooking(data: UpdateBookingSchema, params: BackendParams): Promise<Booking>;
  getBooking(data: GetBookingSchema, params: BackendParams): Promise<Booking>;
  confirmBooking(
    data: ConfirmBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  cancelBooking(data: CancelBookingSchema, params: BackendParams): Promise<Booking>;
  deleteBooking(data: CancelBookingSchema, params: BackendParams): Promise<Booking>;
  extendBooking(data: ExtendBookingSchema, params: BackendParams): Promise<Booking>;
  getBookings(data: GetBookingsSchema, params: BackendParams): Promise<Booking[]>;
  getSupplier(params: BackendParams): Promise<Supplier>;
  createWebhook(data: CreateWebhookSchema, params: BackendParams): Promise<Webhook>;
  deleteWebhook(data: DeleteWebhookSchema, params: BackendParams): Promise<void>;
  listWebhooks(params: BackendParams): Promise<Webhook[]>;
  updateMappings(data: UpdateMappingsSchema, params: BackendParams): Promise<void>;
  getMappings(params: BackendParams): Promise<Mapping[]>;
  createOrder(data: CreateOrderSchema, params: BackendParams): Promise<unknown>;
  updateOrder(data: UpdateOrderSchema, params: BackendParams): Promise<unknown>;
  getOrder(data: GetOrderSchema, params: BackendParams): Promise<unknown>;
  confirmOrder(data: ConfirmOrderSchema, params: BackendParams): Promise<unknown>;
  cancelOrder(data: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  deleteOrder(data: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  extendOrder(data: ExtendOrderSchema, params: BackendParams): Promise<unknown>;
  getGateway(params: BackendParams): Promise<unknown>;
  lookup(data: LookupSchema, params: BackendParams): Promise<unknown>;
  getCapabilities(params: BackendParams): Promise<Capability[]>;
}
