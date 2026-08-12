import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create Admin Client using Service Role Key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if email already exists using the Admin API
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      return NextResponse.json({ error: "Internal server error during validation" }, { status: 500 });
    }

    const userExists = listData.users.some(u => u.email?.toLowerCase() === normalizedEmail);

    if (userExists) {
      return NextResponse.json(
        { 
          code: "EMAIL_ALREADY_REGISTERED", 
          message: "An account with this email already exists. Please sign in instead." 
        }, 
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, exists: false });

  } catch (error) {
    console.error("Error in check-email API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
