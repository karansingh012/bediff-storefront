"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { load } from "@cashfreepayments/cashfree-js";
import { useCartStore, useSubtotal } from "@/lib/cartStore";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCartStore();
  const subtotal = useSubtotal();
  const shipping = 0; // Free shipping placeholder
  const total = subtotal + shipping;
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });

  useEffect(() => {
    // If cart is empty, redirect to home
    if (cart.length === 0) {
      router.push("/");
    }

    // Check user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFormData(prev => ({ ...prev, email: user.email || prev.email }));
        
        // Fetch addresses
        const { data: addresses } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id);
          
        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const def = addresses.find(a => a.is_default) || addresses[0];
          setFormData({
            email: user.email || "",
            fullName: def.full_name,
            phone: def.phone,
            address1: def.address_line_1,
            address2: def.address_line_2 || "",
            city: def.city,
            state: def.state,
            pinCode: def.postal_code,
            country: def.country,
          });
        }
      }
    };
    checkUser();
  }, [cart, router]);

  if (cart.length === 0) {
    return null; // Will redirect
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on typing
  };

  const validateForm = () => {
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!formData.fullName || formData.fullName.length < 2) {
      return "Please enter your full name.";
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      return "Please enter a valid 10-digit Indian phone number.";
    }
    if (!formData.address1) {
      return "Address line 1 is required.";
    }
    if (!formData.city) {
      return "City is required.";
    }
    if (!formData.state) {
      return "State is required.";
    }
    if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode)) {
      return "Please enter a valid 6-digit PIN code.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    if (user && saveAddress) {
      const { error: addressError } = await supabase.from('addresses').insert({
        user_id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        address_line_1: formData.address1,
        address_line_2: formData.address2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.pinCode,
        country: formData.country,
        is_default: savedAddresses.length === 0
      });
      if (addressError) {
        console.error("Failed to save address:", addressError);
      }
    }

    try {
      const cashfree = await load({
        mode: "sandbox",
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customer: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.payment_session_id) {
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-content px-4 md:px-6 py-8 md:py-16">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] text-black">
            CHECKOUT
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT: Customer Form */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Contact */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
                  CONTACT INFORMATION
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="EMAIL ADDRESS"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                      <label htmlFor="fullName" className="sr-only">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="FULL NAME"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="phone" className="sr-only">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="PHONE (10 DIGITS)"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
                  SHIPPING ADDRESS
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="country" className="sr-only">Country</label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black focus:outline-none focus:border-black rounded-none appearance-none"
                    >
                      <option value="India">INDIA</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="address1" className="sr-only">Address Line 1</label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      placeholder="ADDRESS LINE 1"
                      required
                      value={formData.address1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="address2" className="sr-only">Address Line 2</label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      placeholder="APARTMENT, SUITE, ETC. (OPTIONAL)"
                      value={formData.address2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <label htmlFor="city" className="sr-only">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="CITY"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                      />
                    </div>
                    <div className="w-full md:w-1/3">
                      <label htmlFor="state" className="sr-only">State</label>
                      <select
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black focus:outline-none focus:border-black rounded-none appearance-none"
                      >
                        <option value="">STATE</option>
                        <option value="Andhra Pradesh">ANDHRA PRADESH</option>
                        <option value="Arunachal Pradesh">ARUNACHAL PRADESH</option>
                        <option value="Assam">ASSAM</option>
                        <option value="Bihar">BIHAR</option>
                        <option value="Chhattisgarh">CHHATTISGARH</option>
                        <option value="Goa">GOA</option>
                        <option value="Gujarat">GUJARAT</option>
                        <option value="Haryana">HARYANA</option>
                        <option value="Himachal Pradesh">HIMACHAL PRADESH</option>
                        <option value="Jharkhand">JHARKHAND</option>
                        <option value="Karnataka">KARNATAKA</option>
                        <option value="Kerala">KERALA</option>
                        <option value="Madhya Pradesh">MADHYA PRADESH</option>
                        <option value="Maharashtra">MAHARASHTRA</option>
                        <option value="Manipur">MANIPUR</option>
                        <option value="Meghalaya">MEGHALAYA</option>
                        <option value="Mizoram">MIZORAM</option>
                        <option value="Nagaland">NAGALAND</option>
                        <option value="Odisha">ODISHA</option>
                        <option value="Punjab">PUNJAB</option>
                        <option value="Rajasthan">RAJASTHAN</option>
                        <option value="Sikkim">SIKKIM</option>
                        <option value="Tamil Nadu">TAMIL NADU</option>
                        <option value="Telangana">TELANGANA</option>
                        <option value="Tripura">TRIPURA</option>
                        <option value="Uttar Pradesh">UTTAR PRADESH</option>
                        <option value="Uttarakhand">UTTARAKHAND</option>
                        <option value="West Bengal">WEST BENGAL</option>
                        <option value="Delhi">DELHI</option>
                      </select>
                    </div>
                    <div className="w-full md:w-1/3">
                      <label htmlFor="pinCode" className="sr-only">PIN Code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="pinCode"
                        name="pinCode"
                        placeholder="PIN CODE"
                        required
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-xs uppercase tracking-[0.05em] border border-border bg-white text-black placeholder:text-gray-400 focus:outline-none focus:border-black rounded-none"
                      />
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center gap-3 mt-2">
                      <input 
                        type="checkbox" 
                        id="saveAddress" 
                        checked={saveAddress} 
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-black" 
                      />
                      <label htmlFor="saveAddress" className="text-xs uppercase tracking-[0.05em] text-gray-500">
                        Save this address for future checkouts
                      </label>
                    </div>
                  )}
                </div>
              </section>

              {error && (
                <div className="p-4 border border-red-500 bg-red-50">
                  <p className="text-xs text-red-500 uppercase tracking-[0.05em] font-medium">{error}</p>
                </div>
              )}

              {/* Submit - visible on desktop, moved below review on mobile */}
              <div className="hidden lg:block mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none disabled:bg-gray-300"
                >
                  {loading ? "PROCESSING..." : "PROCEED TO PAYMENT"}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: Order Review */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <div className="bg-gray-50 p-6 md:p-8 border border-border sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
                ORDER REVIEW
              </h2>
              
              <div className="flex flex-col gap-6 mb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-white border border-border shrink-0">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-[10px] font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-black">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-[0.05em]">
                        {item.selectedColor} / {item.selectedSize}
                      </p>
                      <p className="text-sm font-medium text-black mt-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 uppercase tracking-[0.05em]">Subtotal</span>
                  <span className="text-black font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 uppercase tracking-[0.05em]">Shipping</span>
                  <span className="text-black font-medium">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="border-t border-border mt-6 pt-6 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-[0.05em] text-black">Total</span>
                <span className="text-lg font-bold text-black">{formatPrice(total)}</span>
              </div>

              {/* Submit - visible on mobile only */}
              <div className="lg:hidden mt-8">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white text-xs font-medium uppercase tracking-[0.05em] hover:bg-gray-800 transition-colors rounded-none disabled:bg-gray-300"
                >
                  {loading ? "PROCESSING..." : "PROCEED TO PAYMENT"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
