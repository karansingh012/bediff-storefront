import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOutButton } from "@/components/LogOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-content mx-auto px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-bold uppercase tracking-[0.1em] text-black">
          MY ACCOUNT
        </h1>
        <p className="text-sm text-gray-500 uppercase tracking-[0.05em] mt-2">
          {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/account/orders" 
            className="text-xs font-bold uppercase tracking-[0.05em] text-black hover:text-gray-500 transition-colors"
          >
            MY ORDERS
          </Link>
          <Link 
            href="/account" 
            className="text-xs font-bold uppercase tracking-[0.05em] text-gray-400 cursor-default"
          >
            ACCOUNT DETAILS
          </Link>
          <LogOutButton />
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-black mb-6 pb-2 border-b border-border">
            ACCOUNT DETAILS
          </h2>
          
          <div className="bg-gray-50 p-6 border border-border">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Email</p>
                <p className="text-sm font-medium text-black mt-1">{user.email}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Full Name</p>
                <p className="text-sm font-medium text-black mt-1">{profile?.full_name || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.05em]">Phone</p>
                <p className="text-sm font-medium text-black mt-1">{profile?.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
