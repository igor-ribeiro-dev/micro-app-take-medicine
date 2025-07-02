# Plano do Sistema de Controle de Medicamentos

## 1. Modelagem de Dados

### a) Medication
- **Fields:**
  - id
  - name
  - dosage
  - time (one or more times per day)
  - createdAt
  - updatedAt

### b) SystemConfig
- **Fields:**
  - id
  - notificationEndpointUrl

---

## 2. Backend (Vapor)

### a) Endpoints RESTful

- **Medications**
  - `POST /medications` — Cadastrar medicamento
  - `GET /medications` — Listar medicamentos
  - `PUT /medications/:id` — Atualizar medicamento
  - `DELETE /medications/:id` — Remover medicamento

- **SystemConfig**
  - `GET /config` — Buscar URL de notificação
  - `PUT /config` — Atualizar URL de notificação

### b) Notificações HTTP

- Agendar/verificar horários dos medicamentos (pode ser via cron ou background job).
- Quando chegar o horário, enviar um POST para o endpoint configurado, com informações do medicamento.

---

## 3. Frontend Moderno (Microfrontend)

- **Framework sugerido:** React, Vue ou Svelte (por serem facilmente integráveis como microfrontends).
- **Funcionalidades:**
  - Tela de listagem/cadastro/edição/remoção de medicamentos.
  - Tela de configurações para informar o endpoint de notificação.
  - Interface responsiva e moderna (usar Material UI, Tailwind, etc).

---

## 4. Fluxo de Uso

1. Usuário cadastra medicamentos com nome, dosagem e horário.
2. Usuário informa o endpoint HTTP para receber notificações.
3. O sistema agenda/verifica os horários e, quando chegar o momento, envia uma notificação HTTP para o endpoint informado.
4. Usuário pode editar ou remover medicamentos a qualquer momento.

---

## 5. Alterações Necessárias no Projeto

### a) Backend
- Criar modelo e migração para Medication.
- Criar modelo e migração para SystemConfig.
- Implementar controllers e rotas RESTful.
- Implementar lógica de agendamento/envio de notificações HTTP.

### b) Frontend
- Criar um microfrontend (ex: em React) com:
  - Tela de medications (CRUD).
  - Tela de configurações.
- Consumir API do backend.

---

## 6. Extras/Opcional
- Autenticação (se necessário).
- Logs de notificações enviadas.
- Suporte a múltiplos horários por medicamento. 