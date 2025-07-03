# Variáveis de Ambiente

Este documento descreve as variáveis de ambiente disponíveis para configurar o frontend.

## Variáveis Disponíveis

### `VITE_SERVICE_TYPE`
**Tipo:** string  
**Padrão:** `'memory'`  
**Opções:** `'memory'` | `'backend'`

Define o tipo de serviço que será usado:
- `'memory'`: Dados armazenados na memória do navegador (localStorage)
- `'backend'`: Conecta com a API Swift backend

### `VITE_API_BASE_URL`
**Tipo:** string  
**Padrão:** `'http://localhost:8080'`

URL base da API do backend Swift.

**Comportamento por ambiente:**
- **Produção**: Se não definido, usa `window.location.origin` (mesmo domínio)
- **Desenvolvimento**: Se não definido, usa `http://localhost:8080`

## Exemplos de Configuração

### Desenvolvimento Local
```env
VITE_SERVICE_TYPE=backend
VITE_API_BASE_URL=http://localhost:8080
```

### Produção
```env
VITE_SERVICE_TYPE=backend
VITE_API_BASE_URL=https://meu-backend.com
```

### Apenas Memória (sem backend)
```env
VITE_SERVICE_TYPE=memory
# VITE_API_BASE_URL não é necessário
```

## Funcionalidades por Ambiente

### Desenvolvimento
- Permite alterar a URL do backend via interface
- URL customizada é salva no localStorage
- Botão para resetar URL para o padrão
- Verificação de conectividade em tempo real

### Produção
- URL do backend é fixa (baseada em VITE_API_BASE_URL ou origem atual)
- Não permite alteração da URL via interface
- Otimizado para performance e segurança

## Como Usar

1. Crie um arquivo `.env` na raiz do projeto frontend
2. Configure as variáveis conforme necessário
3. Reinicie o servidor de desenvolvimento se estiver rodando
4. Em desenvolvimento, você pode alterar a URL do backend via interface de configurações 