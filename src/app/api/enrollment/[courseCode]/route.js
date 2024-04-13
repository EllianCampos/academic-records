import CheckOpenEnrrollment from "@/services/enrollment/CheckOpenEnrrollment";
import { NextResponse } from "next/server";

export async function GET(req, { params}) {
  const result = await CheckOpenEnrrollment(params.courseCode)
  if (!result) return NextResponse.json({ ok: false }, { status: 401 })

  return NextResponse.json({ ok: true })
}