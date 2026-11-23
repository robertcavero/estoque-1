# NutriStock

> Sistema web de gestão de estoque para organização Nutracel

O NutriStock é uma aplicação desenvolvida para bancos de alimentos, cozinhas comunitárias e ONGs que precisam controlar doações, estoque e entregas de alimentos de forma simples e eficiente.

---

## Sobre o Projeto

Desenvolvido como Projeto de Extensão em Desenvolvimento de Software, o NutriStock resolve um problema real: a falta de controle organizado sobre o fluxo de insumos. Com ele, é possível registrar doações recebidas, monitorar validades, registrar as saídas e destinações feitas aos beneficiários, operando exclusivamente como um sistema de gestão de inventário físico.

---

## Funcionalidades

- Autenticação com login por e-mail e senha
- Cadastro, edição e remoção de alimentos em estoque
- Categorização dos alimentos (Não-perecíveis, Hortifruti, etc.)
- Gerenciamento de doadores (cadastrar, editar, remover)
- Cadastro de beneficiários (famílias e instituições)
- Feedback visual de confirmação
- Interface responsiva para desktop e mobile

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | [Next.js 15](https://nextjs.org/) + TypeScript |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) |
| Backend / Banco | [Supabase](https://supabase.com/) (PostgreSQL) |
| Autenticação | Supabase Auth |
| Deploy | [Vercel](https://vercel.com/) |


---

**Tabelas:**
- `categorias` — tipos de insumos
- `doadores` — pessoas físicas ou empresas
- `alimentos` — itens em estoque
- `beneficiarios` — famílias e instituições que recebem doações
- `entregas` — histórico de distribuição dos alimentos

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 18+, conta no Supabase

**1. Clone o repositório**
```bash
git clone https://github.com/robertcavero/estoque-1.git
cd estoque-1
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**
```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

**4. Configure o banco de dados**

Execute o arquivo `nutristock.sql` no SQL Editor do seu projeto Supabase.

**5. Crie um usuário**

No Supabase Dashboard, acesse **Authentication → Users → Add User** e crie a conta da instituição.

**6. Inicie o servidor**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Projeto

```
frontend/
├── app/
│   ├── components/
│   │   └── layout/
│   │       └── Header.tsx           # Cabeçalho
│   ├── doadores/
│   │   ├── editar/[id]/
│   │   │   └── page.tsx             # Editar doador
│   │   ├── novo/
│   │   │   └── page.tsx             # Cadastrar doador
│   │   └── page.tsx                 # Lista de doadores
│   ├── editar/[id]/
│   │   └── page.tsx                 # Editar alimento
│   ├── login/
│   │   └── page.tsx                 # Tela de login
│   ├── novo/
│   │   └── page.tsx                 # Cadastrar alimento
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Tela principal (estoque)
├── lib/
│   ├── supabase.ts                  # Cliente público
│   └── supabase-server.ts           # Cliente servidor
├── proxy.ts                         # Middleware de autenticação
└── nutristock.sql                   # Código SQL (banco de dados)
```

---

## Equipe

Projeto desenvolvido para a disciplina de Projeto de Extensão em Desenvolvimento de Software — 2º Semestre 2026.

---

## 📄 Licença

Este projeto é de uso acadêmico.
