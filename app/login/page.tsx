import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Image from "next/image";
export default async function Login() {
  // Se o usuário já estiver logado, manda ele direto pra tela inicial
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  // A Server Action que processa o formulário de login
  async function fazerLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Em produção usaríamos um state para mostrar o erro na tela
      console.error("Erro no login:", error.message);
      redirect("/login?erro=true");
    }

    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col text-center items-center items  mb-8">
          <h1 className="flex items-center gap-1.5 text-2xl font-bold text-gray-900">
            Bem-vindo(a) ao NutriStock{" "}
            <Image
              src="/box.svg"
              alt="Ícone NutriStock"
              width={32}
              height={32}
            />
          </h1>
          <p className="text-gray-600">Faça login para gerenciar o estoque</p>
        </div>

        <form action={fazerLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail da Instituição
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              placeholder="ong@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </main>
  );
}
