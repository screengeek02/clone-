import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

const ADMIN_ROLES = [
  "COUNTRY_COORDINATOR",
  "SUPER_ADMIN",
  "INSTITUTION_ADMIN"
];

export async function POST(request: NextRequest) {

  const session = await auth();

  if (!session || !session.user || !session.user.role) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const role = session.user.role;

  if (!ADMIN_ROLES.includes(role)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // moderation logic placeholder
  return NextResponse.json({
    success: true,
    action: body.action ?? null
  });

}
