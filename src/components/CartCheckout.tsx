"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  X,
} from "lucide-react";
import BurgerMenu from "./BurgerMenu";
import Footer from "./Footer";
import { useCart } from "@/context/CartContext";

const EXPRESS_SHIPPING = 15;
const PROMO_CODE = "SKYSHARK10";

type DeliveryOption = "standard" | "express";
type PaymentMethod = "cards" | "upi" | "cod";

type CustomerDetails = {
  name: string;
  phone: string;
  alternatePhone: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

const EMPTY_DETAILS: CustomerDetails = {
  name: "",
  phone: "",
  alternatePhone: "",
  address: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
};

const REQUIRED_FIELDS: (keyof CustomerDetails)[] = [
  "name",
  "phone",
  "address",
  "locality",
  "city",
  "state",
  "pincode",
  "country",
];

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "cards",
    title: "Cards",
    description: "Pay securely using Credit or Debit card",
    icon: <CreditCard size={20} strokeWidth={2} />,
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay instantly using any UPI app",
    icon: <Smartphone size={20} strokeWidth={2} />,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: <Banknote size={20} strokeWidth={2} />,
  },
];

function isValidPhone(value: string) {
  return /^\d{7,15}$/.test(value.trim());
}

function isValidPincode(value: string) {
  return /^\d{4,10}$/.test(value.trim());
}

export default function CartCheckout() {
  const pathname = usePathname();
  const { items, itemCount, removeFromCart, updateQuantity, clearCart } = useCart();

  const [delivery, setDelivery] = useState<DeliveryOption>("standard");
  const [details, setDetails] = useState<CustomerDetails>(EMPTY_DETAILS);
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerDetails, boolean>>>({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [popupMethod, setPopupMethod] = useState<PaymentMethod | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = delivery === "express" ? EXPRESS_SHIPPING : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - discount;

  function fieldError(field: keyof CustomerDetails): string | null {
    const value = details[field];
    if (field === "alternatePhone") {
      return value && !isValidPhone(value) ? "Enter a valid phone number" : null;
    }
    if (!value.trim()) return "Required";
    if (field === "phone" && !isValidPhone(value)) return "Enter a valid phone number";
    if (field === "pincode" && !isValidPincode(value)) return "Enter a valid pincode";
    return null;
  }

  const detailsValid = useMemo(() => {
    const requiredOk = REQUIRED_FIELDS.every((field) => !fieldError(field));
    const altOk = !fieldError("alternatePhone");
    return requiredOk && altOk;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const canPlaceOrder =
    items.length > 0 && detailsValid && paymentConfirmed && !placingOrder;

  function handleFieldChange(field: keyof CustomerDetails, value: string) {
    setDetails((prev) => ({ ...prev, [field]: value }));
  }

  function handleFieldBlur(field: keyof CustomerDetails) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSelectPayment(method: PaymentMethod) {
    setPopupMethod(method);
  }

  function handleConfirmPayment(method: PaymentMethod) {
    setPaymentMethod(method);
    setPaymentConfirmed(true);
    setPopupMethod(null);
  }

  function handleApplyPromo() {
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoApplied(false);
      setPromoError(true);
    }
  }

  function handlePlaceOrder() {
    if (!canPlaceOrder) return;
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      setOrderPlaced(true);
      clearCart();
    }, 900);
  }

  return (
    <div className="min-h-screen py-8 sm:py-16 px-3 sm:px-6" style={{ backgroundColor: "#c9bfae" }}>
      <div className="max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-[#f7f5f1]" style={{ color: "#111111" }}>
          {/* Header */}
          <header className="flex items-center justify-between px-5 sm:px-10 py-5 border-b border-black/10">
            <Link
              href="/"
              className="text-sm sm:text-base font-bold tracking-wide"
              style={{ fontFamily: "var(--font-logo), sans-serif", letterSpacing: "0.06em" }}
            >
              SKYSHARK
            </Link>

            <nav className="hidden sm:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em]">
              <Link href="/" className={pathname === "/" ? "opacity-100" : "opacity-50 hover:opacity-100 transition-opacity"}>
                Home
              </Link>
              <Link href="/products" className={pathname === "/products" ? "opacity-100" : "opacity-50 hover:opacity-100 transition-opacity"}>
                Products
              </Link>
              <Link href="/cart" className={pathname === "/cart" ? "opacity-100" : "opacity-50 hover:opacity-100 transition-opacity"}>
                Cart
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={18} strokeWidth={2} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: "#111111" }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <BurgerMenu fixed={false} />
            </div>
          </header>

          <div className="px-5 sm:px-10 py-8 sm:py-12">
            <h1
              className="uppercase font-extrabold tracking-tight mb-8 sm:mb-12"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1 }}
            >
              Checkout
            </h1>

            {items.length === 0 && !orderPlaced ? (
              <EmptyCart />
            ) : orderPlaced ? (
              <OrderPlaced />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16">
                {/* LEFT: form */}
                <div>
                  <h2 className="text-lg font-bold mb-4">Customer Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                    <FormField
                      label="Full Name"
                      value={details.name}
                      onChange={(v) => handleFieldChange("name", v)}
                      onBlur={() => handleFieldBlur("name")}
                      error={touched.name ? fieldError("name") : null}
                    />
                    <FormField
                      label="Phone Number"
                      value={details.phone}
                      onChange={(v) => handleFieldChange("phone", v)}
                      onBlur={() => handleFieldBlur("phone")}
                      error={touched.phone ? fieldError("phone") : null}
                    />
                    <FormField
                      label="Alternate Phone Number (optional)"
                      value={details.alternatePhone}
                      onChange={(v) => handleFieldChange("alternatePhone", v)}
                      onBlur={() => handleFieldBlur("alternatePhone")}
                      error={touched.alternatePhone ? fieldError("alternatePhone") : null}
                    />
                    <FormField
                      label="Address"
                      value={details.address}
                      onChange={(v) => handleFieldChange("address", v)}
                      onBlur={() => handleFieldBlur("address")}
                      error={touched.address ? fieldError("address") : null}
                    />
                    <FormField
                      label="Locality"
                      value={details.locality}
                      onChange={(v) => handleFieldChange("locality", v)}
                      onBlur={() => handleFieldBlur("locality")}
                      error={touched.locality ? fieldError("locality") : null}
                    />
                    <FormField
                      label="City"
                      value={details.city}
                      onChange={(v) => handleFieldChange("city", v)}
                      onBlur={() => handleFieldBlur("city")}
                      error={touched.city ? fieldError("city") : null}
                    />
                    <FormField
                      label="State"
                      value={details.state}
                      onChange={(v) => handleFieldChange("state", v)}
                      onBlur={() => handleFieldBlur("state")}
                      error={touched.state ? fieldError("state") : null}
                    />
                    <FormField
                      label="Pincode"
                      value={details.pincode}
                      onChange={(v) => handleFieldChange("pincode", v)}
                      onBlur={() => handleFieldBlur("pincode")}
                      error={touched.pincode ? fieldError("pincode") : null}
                    />
                    <FormField
                      label="Country"
                      value={details.country}
                      onChange={(v) => handleFieldChange("country", v)}
                      onBlur={() => handleFieldBlur("country")}
                      error={touched.country ? fieldError("country") : null}
                    />
                  </div>

                  <h2 className="text-lg font-bold mb-4">Delivery</h2>
                  <div className="flex flex-col gap-3 mb-10">
                    <RadioRow
                      checked={delivery === "standard"}
                      onSelect={() => setDelivery("standard")}
                      title="Standard Delivery"
                      subtitle="Delivery within 5-7 days"
                      trailing="Free"
                    />
                    <RadioRow
                      checked={delivery === "express"}
                      onSelect={() => setDelivery("express")}
                      title="Express Shipping"
                      subtitle="Delivery within 1-3 days"
                      trailing={`$${EXPRESS_SHIPPING.toFixed(2)}`}
                    />
                  </div>

                  <h2 className="text-lg font-bold mb-4">Payment</h2>
                  <div className="flex flex-col gap-3 mb-10">
                    {PAYMENT_OPTIONS.map((option) => (
                      <PaymentRow
                        key={option.id}
                        option={option}
                        selected={paymentMethod === option.id && paymentConfirmed}
                        onSelect={() => handleSelectPayment(option.id)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={!canPlaceOrder}
                    title={
                      !canPlaceOrder
                        ? "Fill in all required details and select a payment method"
                        : undefined
                    }
                    className="w-full rounded-full py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#111111" }}
                  >
                    {placingOrder ? "Processing..." : "Place Order"}
                  </button>
                  {!canPlaceOrder && (
                    <p className="text-xs opacity-50 mt-3">
                      Complete your customer details and choose a payment method to place your order.
                    </p>
                  )}
                </div>

                {/* RIGHT: shopping bag */}
                <div>
                  <h2 className="text-lg font-bold mb-6">Shopping Bag ({items.length})</h2>

                  <div className="flex flex-col gap-5 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden shrink-0"
                          style={{ backgroundColor: "#e7e3da" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                            draggable={false}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-bold">{item.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="opacity-40 hover:opacity-80 transition-opacity"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>
                          {item.meta?.map((m) => (
                            <p key={m.label} className="text-xs opacity-60 mt-0.5">
                              {m.label}: <span className="opacity-90">{m.value}</span>
                            </p>
                          ))}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 border border-black/15 rounded-full px-1.5 py-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100"
                              >
                                <Minus size={12} strokeWidth={2.5} />
                              </button>
                              <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100"
                              >
                                <Plus size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                            <span className="text-sm font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(false);
                      }}
                      placeholder="Promocode"
                      className="flex-1 min-w-0 border border-black/15 rounded-full px-4 py-2.5 text-sm bg-white/60 placeholder:text-black/40 focus:outline-none focus:border-black/40"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors"
                      style={{
                        backgroundColor: promoApplied ? "#111111" : "#e7e3da",
                        color: promoApplied ? "#ffffff" : "#111111",
                      }}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-600 -mt-4 mb-6">
                      Invalid promo code. Try &ldquo;{PROMO_CODE}&rdquo;.
                    </p>
                  )}

                  <div className="flex flex-col gap-2 text-sm border-t border-black/10 pt-5">
                    <div className="flex items-center justify-between opacity-70">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between opacity-70">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center justify-between opacity-70">
                      <span>Discount</span>
                      <span>{discount === 0 ? "$0.00" : `-$${discount.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-extrabold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dark CTA band */}
        <div className="bg-[#111111] text-[#f4f1e8] px-5 sm:px-10 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div className="max-w-xs">
              <p className="text-lg font-bold uppercase mb-2">Get in touch with Skyshark</p>
              <p className="text-sm opacity-60">
                Contact us and our team will be happy to answer all your questions.
              </p>
            </div>
            <h2
              className="uppercase font-extrabold text-right"
              style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(28px, 5.5vw, 64px)", lineHeight: 0.95 }}
            >
              Bring Your
              <br />
              Ideas To Life
            </h2>
          </div>
        </div>

        <Footer />
      </div>

      {popupMethod && (
        <PaymentPopup
          method={popupMethod}
          onClose={() => setPopupMethod(null)}
          onConfirm={() => handleConfirmPayment(popupMethod)}
        />
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
      <ShoppingBag size={40} strokeWidth={1.5} className="opacity-30 mb-4" />
      <p className="text-lg font-bold mb-2">Your bag is empty</p>
      <p className="text-sm opacity-60 mb-6">
        Looks like you haven&apos;t added any 3D models yet.
      </p>
      <Link
        href="/products"
        className="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#111111" }}
      >
        Browse Products
      </Link>
    </div>
  );
}

function OrderPlaced() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "#111111" }}
      >
        <Check size={26} strokeWidth={2.5} className="text-white" />
      </div>
      <p className="text-lg font-bold mb-2">Order placed successfully</p>
      <p className="text-sm opacity-60 mb-6">
        Thanks for your order! A confirmation has been sent to you.
      </p>
      <Link
        href="/products"
        className="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#111111" }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] opacity-50 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full bg-transparent border-b pb-2 text-sm focus:outline-none transition-colors"
        style={{ borderColor: error ? "#dc2626" : "rgba(0,0,0,0.2)" }}
      />
      {error && <span className="block text-[11px] text-red-600 mt-1">{error}</span>}
    </label>
  );
}

function RadioRow({
  checked,
  onSelect,
  title,
  subtitle,
  trailing,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  trailing?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center justify-between w-full text-left rounded-xl border px-4 py-3 transition-colors"
      style={{
        borderColor: checked ? "#111111" : "rgba(0,0,0,0.12)",
        backgroundColor: checked ? "rgba(17,17,17,0.03)" : "transparent",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
          style={{ borderColor: checked ? "#111111" : "rgba(0,0,0,0.3)" }}
        >
          {checked && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#111111" }} />}
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {subtitle && <p className="text-xs opacity-50">{subtitle}</p>}
        </div>
      </div>
      {trailing && <span className="text-sm font-semibold">{trailing}</span>}
    </button>
  );
}

function PaymentRow({
  option,
  selected,
  onSelect,
}: {
  option: { id: PaymentMethod; title: string; description: string; icon: React.ReactNode };
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center justify-between w-full text-left rounded-xl border px-4 py-3 transition-colors"
      style={{
        borderColor: selected ? "#111111" : "rgba(0,0,0,0.12)",
        backgroundColor: selected ? "rgba(17,17,17,0.03)" : "transparent",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
          style={{ borderColor: selected ? "#111111" : "rgba(0,0,0,0.3)" }}
        >
          {selected && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#111111" }} />}
        </span>
        <span className="opacity-60">{option.icon}</span>
        <div>
          <p className="text-sm font-semibold">{option.title}</p>
          <p className="text-xs opacity-50">{option.description}</p>
        </div>
      </div>
      {selected && (
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: "#111111" }}
        >
          Selected
        </span>
      )}
    </button>
  );
}

function PaymentPopup({
  method,
  onClose,
  onConfirm,
}: {
  method: PaymentMethod;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const option = PAYMENT_OPTIONS.find((o) => o.id === method)!;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 100, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#f7f5f1] p-6 sm:p-8"
        style={{ color: "#111111" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(17,17,17,0.06)" }}
            >
              {option.icon}
            </span>
            <div>
              <p className="text-base font-bold">{option.title}</p>
              <p className="text-xs opacity-50">{option.description}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="opacity-50 hover:opacity-100">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div
          className="rounded-xl border border-dashed px-4 py-6 text-center mb-6"
          style={{ borderColor: "rgba(0,0,0,0.15)" }}
        >
          <p className="text-sm opacity-60">
            {option.title} details will be added here soon.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full py-3 text-sm font-semibold border border-black/15 hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#111111" }}
          >
            Confirm {option.title}
          </button>
        </div>
      </div>
    </div>
  );
}
