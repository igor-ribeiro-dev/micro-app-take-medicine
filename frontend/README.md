# SwiftTakeMedicine - Sistema de Gestão de Medicamentos

Sistema simplificado para gestão de medicamentos com arquitetura modular de serviços.

## 🏗️ Arquitetura de Serviços

O sistema implementa uma arquitetura modular com dois serviços independentes:

### 🧠 Memory Service (`memoryService`)
- Armazenamento in-memory no navegador
- Ideal para desenvolvimento, testes e uso standalone
- Dados persistem apenas durante a sessão
- Não requer backend

### 🌐 Backend Service (`backendService`) 
- Conecta com API REST externa
- Dados persistentes no servidor
- Ideal para produção
- **SEM fallback automático** - falhas retornam erro

## ⚙️ Configuração via .env

Configure qual serviço usar através de variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

### Para usar Memory Service (padrão):
```bash
# .env
VITE_SERVICE_TYPE=memory
```

### Para usar Backend Service:
```bash
# .env  
VITE_SERVICE_TYPE=backend
VITE_API_BASE_URL=http://localhost:8080
```

## 🌍 Funcionalidade de Ambiente

O sistema detecta automaticamente o ambiente e se comporta diferentemente:

### 🏭 Produção
- Usa `VITE_API_BASE_URL` ou `window.location.origin` (mesmo domínio)
- URL do backend é fixa e não pode ser alterada via interface
- Otimizado para performance e segurança

### 🛠️ Desenvolvimento  
- Permite configurar URL do backend via interface
- URL customizada é salva no localStorage
- Botão para resetar URL para o padrão
- Verificação de conectividade em tempo real

## 🚫 Comportamento de Falhas

- **Memory Service**: Sempre funciona (dados na memória)
- **Backend Service**: Se a API falhar, retorna erro (sem fallback)
- Logs detalhados no console para debugging
- Indicador visual no header mostra o status da conexão

## 📡 Endpoints da API Backend

O Backend Service espera que a API implemente:

### Medicamentos
- `POST /medications` - Criar medicamento
- `GET /medications` - Listar medicamentos
- `PUT /medications/:id` - Atualizar medicamento
- `DELETE /medications/:id` - Remover medicamento

### Configuração
- `GET /config` - Buscar configuração
- `PUT /config` - Atualizar configuração

### Health Check
- `GET /health` - Verificar status da API

## 📊 Estrutura dos Dados

### Medicamento
```json
{
  "id": "uuid",
  "name": "string",
  "dosage": "string", 
  "time": "HH:MM"
}
```

### Configuração
```json
{
  "notificationEndpointUrl": "string"
}
```

### Notificação
```json
{
  "message": "string",
  "medication": "Medication",
  "timestamp": "ISO string"
}
```

## 🚀 Funcionalidades

1. **✅ Criar medicamento** - Adicionar novos medicamentos
2. **📋 Listar medicamentos** - Visualizar todos os medicamentos
3. **✏️ Atualizar medicamento** - Editar medicamentos existentes
4. **🗑️ Remover medicamento** - Excluir medicamentos
5. **⚙️ Configurar endpoint** - Definir URL para notificações
6. **📤 Enviar notificações** - Disparar notificações para endpoint

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔍 Indicadores Visuais

O header mostra o status atual do serviço:

- **🟢 Backend API**: Backend conectado e funcionando
- **🔴 Backend API**: Backend configurado mas desconectado
- **🔵 Memory Service**: Usando serviço in-memory

### 📊 Painel de Configurações

O painel de configurações mostra informações detalhadas:
- **Ambiente**: Produção ou Desenvolvimento
- **Status da conexão**: Conectado/Desconectado
- **URL do backend**: URL atual configurada
- **Configuração de URL**: Em desenvolvimento, permite alterar a URL do backend

## 🧪 Testando os Serviços

### Memory Service
1. Configure `VITE_SERVICE_TYPE=memory`
2. Todos os dados ficam na memória do navegador
3. Use o botão "Limpar Dados da Memória" nas configurações

### Backend Service
1. Configure `VITE_SERVICE_TYPE=backend`
2. Configure `VITE_API_BASE_URL` para sua API
3. Use o botão de refresh no header para verificar conectividade
4. **Importante**: Se a API estiver offline, operações falharão

## 🔧 Tecnologias

- **React 18** + TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Vite** como build tool
- **Arquitetura modular** com serviços independentes

## 📝 Logs e Debugging

O sistema fornece logs detalhados no console:

```
🔧 API Service initialized with: MEMORY
Memory Service: POST /medications {...}
🏥 Backend health check: ✅ Connected
🏥 Backend health check: ❌ Failed
```

Isso facilita o debugging e monitoramento do comportamento do sistema.