# 🚀 Rangooo — Contexto do Projeto & Roadmap de Reestruturação

## 📌 Visão Geral

- **O que é:** Rangooo é uma plataforma de gestão e vendas para estabelecimentos do setor de alimentação, com foco em restaurantes, lanchonetes, pizzarias e negócios que trabalham com delivery.

O objetivo principal é centralizar a operação do estabelecimento em um único ecossistema, abrangendo recebimento e gestão de pedidos, organização da produção, atendimento, delivery, gestão administrativa e relacionamento com clientes.

A plataforma atende principalmente pequenos e médios estabelecimentos, oferecendo ferramentas para digitalizar e organizar a operação sem exigir uma estrutura tecnológica complexa.

- **Status Atual:** Rangooo está em produção e possui estabelecimentos utilizando o sistema atualmente. Portanto, alterações devem priorizar compatibilidade, estabilidade e evolução incremental, evitando mudanças destrutivas ou refatorações de grande impacto sem planejamento.

### Aplicações já em Produção

1. **App Rangooo**: aplicação com Next/React/Ts onde o usuário final faz o pedido.
2. **Rangooo Admin**: aplicação com Next/React/Ts, admintrativo da plataforma.
3. **Admin Estabelecimentos**: aplicação com Next/React/Ts, administrativo dos estabelecimentos.
4. **Rangooo SDK**: aplicação com Next/React/Ts, ainda na fase de implementação.
5. **Rangooo Entregas**: aplicação com Next/React/Ts, app do entregador.
6. **Agente de Impressão Rangooo**: aplicação Desktop com o Electron e Js, para a impressão dos recibos dos pedidos.
7. **Servidor WebSocket**: servidor que fica ouvindo os pedidos e envia para o Agente de Impressão.
8. **Sistema Rangooo**: ladding page da plataforma para a captação e onboarding inicial de clientes.
9. **Package do schema.prisma**: pacote com schema com o schema do projeto no GitHub.

## 🛠️ Stack Tecnológica

- **Frontend / Apps:**
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - React Hook Form
  - Zod
  - PWA
  - Electron (Agente de Impressão)

- **Backend / DB:**
  - Next.js / Node.js
  - Prisma ORM
  - PostgreSQL
  - Neon
  - GitHub Packages (pacotes privados)
  - WebSockets

- **Infra / Outros:**
  - Vercel
  - Pusher
  - Web Push / VAPID
  - Cloudinary
  - Google Authentication
  - Impressão térmica (80mm)
  - Electron Print Agent

## 🏗️ Arquitetura & Diretrizes de Código

### Organização

- O sistema é composto por múltiplas aplicações que compartilham código e modelos de dados através de pacotes privados.
- A camada de acesso ao banco de dados é centralizada no pacote `@misael1981/rangooo-database`.
- O schema do Prisma é mantido no pacote de banco de dados e consumido pelas aplicações.
- As aplicações possuem responsabilidades distintas e não devem assumir responsabilidades pertencentes a outros módulos.
- Componentes de UI devem seguir os padrões já utilizados no projeto, priorizando shadcn/ui e os componentes existentes antes da criação de novos padrões.

### Tipagem e Dados

- TypeScript é utilizado como linguagem principal e a tipagem deve ser preservada.
- Evitar `any`; quando um tipo não estiver disponível, investigar sua origem antes de contornar a tipagem.
- Tipos derivados do Prisma devem ser utilizados sempre que representarem entidades ou relações do banco.
- Alterações no Prisma devem ser tratadas como alterações de contrato e avaliadas considerando todas as aplicações que utilizam o pacote de banco de dados.
- Validações de entrada devem utilizar os schemas existentes com Zod.

### Formulários

- Formulários utilizam React Hook Form em conjunto com Zod.
- Componentes de formulário devem seguir o padrão já estabelecido no projeto, evitando duplicação de lógica de validação e gerenciamento de estado.

### Pontos de Atenção

- O Rangooo está em produção. Alterações devem ser incrementais e considerar compatibilidade com funcionalidades existentes.
- Antes de alterar modelos, enums ou relações do Prisma, verificar quais aplicações e funcionalidades dependem deles.
- Antes de alterar contratos compartilhados, verificar seus consumidores.
- Não criar abstrações ou estruturas novas quando já existir um padrão equivalente no projeto.
- Não realizar refatorações amplas durante a implementação de uma feature sem avaliar separadamente o impacto da refatoração.
- Não utilizar dados fictícios, seeds ou mocks como solução permanente para funcionalidades do sistema.

### Regras consolidadas

- TypeScript como linguagem principal.
- Evitar `any`.
- Prisma centralizado no pacote `@misael1981/rangooo-database`.
- Zod para validação.
- React Hook Form para formulários.
- shadcn/ui como base dos componentes de interface.
- Alterações no banco devem considerar todos os consumidores do pacote.
- Alterações devem preservar compatibilidade com o sistema em produção.

## 📋 Roadmap por Etapas (Fases de Execução)

- [ ] **Fase 1:** Gestão de contratos e assinaturas dos estabelecimentos
  - Contrato online
  - Gerenciamento do plano contratado
  - Controle de vencimento
  - Aviso de vencimento no Admin Estabelecimento
  - Recibo de pagamento com opção de impressão

- [ ] **Fase 2:** Registro de pedidos realizados por telefone
  - Permitir que pedidos recebidos por ligação sejam registrados diretamente no Admin Estabelecimento.

- [ ] **Fase 3:** Refatoração do SDK
  - Revisão da estrutura atual
  - Correção de problemas identificados
  - Adequação do SDK às necessidades atuais da plataforma

## 📝 Registro do Último Ponto de Parada (Handover)

- **O que foi feito no último chat:** Criação do CONTEXT.md
- **Próximo passo imediato:** Atualizar o schema.prisma
