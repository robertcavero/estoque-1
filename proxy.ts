import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Inicializa a resposta para podermos manipular os cookies
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Cria o cliente Supabase específico para o middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Verifica a sessão atual do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // REGRA DE PROTEÇÃO:
  // Se não houver usuário logado E a pessoa tentar acessar a raiz '/' ou '/novo' ou '/editar'
  // Redireciona para a tela de '/login'
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// Configura em quais rotas este middleware vai rodar (basicamente em tudo, menos arquivos estáticos e imagens)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
