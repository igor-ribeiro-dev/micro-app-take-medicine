# Testes de API - SwiftTakeMedicine

Abaixo estão exemplos de requisições curl para testar as rotas principais da API. Você pode colar o conteúdo JSON no Postman e usar os mesmos endpoints.

---

## 1. Criar um novo medicamento
```bash
curl -X POST http://localhost:8080/medications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol",
    "dosage": "500mg",
    "time": "08:00"
}'
```

---

## 2. Listar todos os medicamentos
```bash
curl http://localhost:8080/medications
```

---

## 3. Atualizar um medicamento
(Substitua `<id>` pelo UUID do medicamento que deseja atualizar)
```bash
curl -X PUT http://localhost:8080/medications/<id> \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<id>",
    "name": "Paracetamol",
    "dosage": "750mg",
    "time": "08:00"
}'
```

---

## 4. Remover um medicamento
(Substitua `<id>` pelo UUID do medicamento)
```bash
curl -X DELETE http://localhost:8080/medications/<id>
```

---

## 5. Buscar configuração do endpoint de notificação
```bash
curl http://localhost:8080/config
```

---

## 6. Atualizar configuração do endpoint de notificação
```bash
curl -X PUT http://localhost:8080/config \
  -H "Content-Type: application/json" \
  -d '{
    "notificationEndpointUrl": "https://meu-endpoint.com/notify"
}'
``` 