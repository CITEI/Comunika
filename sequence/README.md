# Diagramas de Sequência

## Login

```mermaid
sequenceDiagram
    User->>App: Efetua login
    App->>API: Envia credenciais
    API->>DB: Puxa user do banco
    DB-->>API: Credenciais
    API->>API: Validar
    alt valido
        API-->>App: Token
        App-->>User: Dashboard
    else invalido
        API-->>App: 403
        App-->>User: Mensagem de erro
    end

```
### Payload:

```typescript
interface Auth {
    email: string,
    password: string
}
```
---
## Jogo
```mermaid
sequenceDiagram
    User->>App: Loga no App
    App->>API: GET user/modules/
    Note over App,API: Token necessário
    API->>DB: Pede os modules do usuário
    DB-->>API: Modules[]
    API-->>App: Modules[]
    App->>App: Verifica quais módulos estão disponíveis
    App-->>User: Renderiza
    User->>App: Seleciona o módulo
    App->>API: GET /user/box/"ID do Módulo"
    API->>DB: Pede a box do user para esse módulo
    DB-->>API: Retorna a box
    API-->>App: Entrega os dados
    App-->>User: Inicia as atividades
```

### Resposta:
```typescript
// Retorna em GET user/modules/
interface Module {
    id: string,
    name: string,
    image: string,
    imageAlt: string,
    available: boolean // Isso diz se o usuário pode acessar o módulo.
}

// Retorna em /user/box/id_do_módulo
interface Box {
    module: string,
    activities: Array<{
        activity: Activity, 
        answers: boolean[]
    }>
}
```
---
## Responder atividade
```mermaid
sequenceDiagram
    User->>App: Responde as perguntas
    App->>API: POST /user/box
    Note over App,API: Token necessário
    API->>DB: Pede a Box do user para esse módulo
    DB-->>API: Retorna a Box
    API->>API: Calcula o resultado
    API->>DB: Libera o próximo módulo para o usuário
    Note over API, DB: As duas operações abaixo são feitas em uma única query
    API->>DB: Insere a Box no histórico do usuário
    API->>DB: Cria uma nova Box para o módulo
    API-->>App: Retorna o resultado (% de SIM)
    App-->>User: Exibe a tela de finalização
```
### Payload:
```ts
interface Answer {
    module: string,
    answers: boolean[]
}
```