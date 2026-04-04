// Temporarily disabled for login-free development
export async function GET() {
  return new Response("Auth is temporarily disabled", { status: 404 });
}

export async function POST() {
  return new Response("Auth is temporarily disabled", { status: 404 });
}
