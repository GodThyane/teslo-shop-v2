export interface PayPalOrderStatusResponse {
   id: string;
   intent: string;
   status: string;
   payment_source: PayPalOrderStatusResponsePaymentSource;
   purchase_units: PayPalOrderStatusResponsePurchaseUnits[];
   payer: PayPalOrderStatusResponsePayer;
   create_time: string;
   update_time: string;
   links: PayPalOrderStatusResponseLinks[];
}

export interface PayPalOrderStatusResponsePaymentSourcePaypalName {
   given_name: string;
   surname: string;
}

export interface PayPalOrderStatusResponsePaymentSourcePaypalAddress {
   country_code: string;
}

export interface PayPalOrderStatusResponsePaymentSourcePaypal {
   email_address: string;
   account_id: string;
   account_status: string;
   name: PayPalOrderStatusResponsePaymentSourcePaypalName;
   address: PayPalOrderStatusResponsePaymentSourcePaypalAddress;
}

export interface PayPalOrderStatusResponsePaymentSource {
   paypal: PayPalOrderStatusResponsePaymentSourcePaypal;
}

export interface PayPalOrderStatusResponsePurchaseUnitsAmount {
   currency_code: string;
   value: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPayee {
   email_address: string;
   merchant_id: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsShippingName {
   full_name: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsShippingAddress {
   address_line_1: string;
   admin_area_2: string;
   admin_area_1: string;
   postal_code: string;
   country_code: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsShipping {
   name: PayPalOrderStatusResponsePurchaseUnitsShippingName;
   address: PayPalOrderStatusResponsePurchaseUnitsShippingAddress;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesAmount {
   currency_code: string;
   value: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerProtection {
   status: string;
   dispute_categories: string[];
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownGrossAmount {
   currency_code: string;
   value: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownPaypalFee {
   currency_code: string;
   value: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownNetAmount {
   currency_code: string;
   value: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdown {
   gross_amount: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownGrossAmount;
   paypal_fee: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownPaypalFee;
   net_amount: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdownNetAmount;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesLinks {
   href: string;
   rel: string;
   method: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPaymentsCaptures {
   id: string;
   status: string;
   amount: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesAmount;
   final_capture: boolean;
   seller_protection: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerProtection;
   seller_receivable_breakdown: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesSellerReceivableBreakdown;
   links: PayPalOrderStatusResponsePurchaseUnitsPaymentsCapturesLinks[];
   create_time: string;
   update_time: string;
}

export interface PayPalOrderStatusResponsePurchaseUnitsPayments {
   captures: PayPalOrderStatusResponsePurchaseUnitsPaymentsCaptures[];
}

export interface PayPalOrderStatusResponsePurchaseUnits {
   reference_id: string;
   amount: PayPalOrderStatusResponsePurchaseUnitsAmount;
   payee: PayPalOrderStatusResponsePurchaseUnitsPayee;
   shipping: PayPalOrderStatusResponsePurchaseUnitsShipping;
   payments: PayPalOrderStatusResponsePurchaseUnitsPayments;
   invoice_id: string;
}

export interface PayPalOrderStatusResponsePayerName {
   given_name: string;
   surname: string;
}

export interface PayPalOrderStatusResponsePayerAddress {
   country_code: string;
}

export interface PayPalOrderStatusResponsePayer {
   name: PayPalOrderStatusResponsePayerName;
   email_address: string;
   payer_id: string;
   address: PayPalOrderStatusResponsePayerAddress;
}

export interface PayPalOrderStatusResponseLinks {
   href: string;
   rel: string;
   method: string;
}
