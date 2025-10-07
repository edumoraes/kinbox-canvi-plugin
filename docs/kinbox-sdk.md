<p align="center">
  <a href="https://kinbox.com.br">
    <img src="https://i.imgur.com/ivexcwX.png" width="300" alt="Kinbox-api Logo" />
  </a>
</p>

<h1 align="center">Kinbox Plugin-SDK</h1>

<div align="center">

✨✨✨ Kinbox frontend plugin library ✨✨✨

[![Prod Kinbox](https://img.shields.io/badge/Prod-Kinbox-blue)](https://app.kinbox.com.br/settings/instagram-demo)
[![Staging Kinbox](https://img.shields.io/badge/Staging-Kinbox-green)](https://app.kinbox.com.br/settings/instagram-demo)

</div>

## 🤔 O que é?

Use essa lib para construir um plugin para o Kinbox. Um plugin é um iframe que fica no contexto da conversa selecionada no Kinbox. Então por exemplo, quando o usuário selecionar uma conversa específica você pode através do plugin identificar que conversa o usuário está visualizando, puxar informações sobre esse contato do seu servidor e mostrar para o usuário. Tudo isso sem precisar sair do Kinbox.

Caso você queira realizar ações no Kinbox, essa lib facilita a comunicação com as API's do Kinbox como atribuir membro a uma conversa, mover para um grupo, adicionar tag, obter informação da conversa em foco, obter informações do ambiente (lista de membros, grupos, tags, etc.).

Então para usar a lib, você deve criar uma página html e importar a lib no head. Essa página você deve hospedar em um servidor como por exemplo o Github Pages (Gratuito) e usar o link da página para colocar no plugin no Kinbox. Para cadastrar o plugin, no Kinbox vá em Configurações > Integrações > Plugin e clique no botão para adicionar novo plugin.

Criamos uma página de exemplo que contém algumas ações de exemplo para você se basear quando for criar seu próprio plugin:

https://github.com/andrody/kinbox-plugin-example

Assista o vídeo tutorial abaixo para uma explicação passo-a-passo:

[![Youtube Tutorial](https://img.youtube.com/vi/iEn0_4kE3rI/0.jpg)](https://youtu.be/iEn0_4kE3rI?si=4L_7z6XRb-YGWG0g)

## 📦 Instalação da lib no plugin

Coloque o script abaixo no head do seu html

```html
<script src="https://andrody.github.io/kinbox-lib/kinboxjs.js"></script>
```

## 📦 Instalação do plugin no Kinbox

No Kinbox vá em Configurações > Integrações > Plugin e cole o endereço do seu html no campo "Endpoint".

Caso você queira usar o nosso plugin de demonstração (https://github.com/andrody/kinbox-plugin-example), copie o seguinte endpoint do github pages:

```
https://andrody.github.io/kinbox-plugin-example/
```


## 🔍 Eventos
Com essa lib você pode escutar eventos, como por exemplo para saber quando o agente estiver visualizando uma conversa específica (Assim você pode mostrar informações relevantes para essa conversa) ou você pode executar ações no Kinbox. Abaixo vamos ver os eventos possíveis de serem escutados e logo depois as ações.

### Conversa

```javascript
// Dados da conversa que o usuário está visualizando no momento
Kinbox.on("conversation", function (payload) {
    console.log(payload)
})
```

Exemplo do payload da conversa obtida no evento "conversation"

```json
{
    "contact": {
        "id": "744",
        "customFields": {
            "cpf": {
                "type": "text",
                "value": null
            },
            "idade": {
                "type": "text",
                "value": "62"
            }
        },
        "name": "Romerio",
        "avatar": "https://pps.whatsapp.net/v/t61.24694-24/85538138_656191448516145_3988189912225985384_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVwdN5_veazn3xKmC7dIlUPNHimgVQpetjc_N_7tj79VUw&oe=6313E547",
        "email": null,
        "phone": "558599253056"
    },
    "conversation": {
        "id": "740",
        "identifier": "558599253056@c.us",
        "assignee": {
            "id": "1"
        },
        "group": {
            "id": null
        },
        "channel_type": "whatsapp",
        "link": "https://app.kinbox.com.br/inbox/all/740",
        "tags": []
    },
    "user": {
        "id": "2",
        "name": "Andrew Feitosa",
        "phone": "85972818387",
        "avatar": "7e3832b0-dda4-11ec-bd38-71b0cf6548e9.jfif",
        "email": "andrewcsz@gmail.com",
        "isActive": true
    },
    "dev": false
}
```

## ⚔️ Ações

### Loading

```javascript
// Mostra animação de carregamento
Kinbox.loading(true)

// Retira animação de carregamento
Kinbox.loading(false)
```

### Toast

Mostra uma notificação para o usuário

```javascript
// Notificação de sucesso
Kinbox.toast("success", "Coloque aqui algum aviso")

// Notificação de erro
Kinbox.toast("error", "Coloque aqui algum aviso")

// Notificação de warning
Kinbox.toast("warning", "Coloque aqui algum aviso")

// Notificação de info
Kinbox.toast("info", "Coloque aqui algum aviso")
```

### Dialog

Mostra uma modal no meio da tela que o usuário pode cancelar ou confirmar alguma ação.

```javascript
Kinbox.dialog(
    "confirm",
    {
        title: "Você confirma?",
        description: `Tem certeza que quer realizar essa ação??`,
        okText: "Confirmar",
        cancelText: "Cancelar",
    },
    function (confirmed) {
        if (confirmed) {
            // Realizar alguma ação, como por exemplo uma requisição http
            Kinbox.toast("success", "Você realizou a ação com sucesso")
        } else {
            Kinbox.toast("error", "Você cancelou e não quis realizar a ação")
        }
    }
)
```

### Setar campo customizado

Altera uma ou mais campos customizados do contato ou da sessão. No exemplo abaixo estamos setando o campo que tem a chave reservada "idade" para o valor 20.

```javascript
// Campo do contato
Kinbox.setProperty({
    key: "idade-changed",
    type: "contact",
    contactId: conversation.contact.id,
    fields: {
        idade: { value: 20 },
    },
})

// Campo de sessão
Kinbox.setProperty({
    key: "idade-changed",
    type: "session",
    sessionId: conversation.session.id,
    fields: {
        idade_sessao: { value: 20 },
    },
})
```

### Atribuir a um agente

No exemplo abaixo estamos atribuindo a um operador de id "1"

```javascript
Kinbox.assignTo(1)
```

### Atribuir a um grupo

No exemplo abaixo estamos movendo a um grupo de id "1"

```javascript
Kinbox.moveToGroup(1)
```

### Adicionar tag

No exemplo abaixo estamos adicionando a tag de id "1"

```javascript
Kinbox.addTag(1)
```

### Remover tag

No exemplo abaixo estamos removendo a tag de id "1"

```javascript
Kinbox.removeTag(1)
```

### Enviar formulário

Você pode pedir para o usuário preencher um formulário e ter os dados retornados para você no callback.
Você deve montar quais são os campos do formulário no array "items" e passar o tipo do campo. Todos os tipos suportados estão listados no exemplo abaixo: 

```javascript
Kinbox.sendForm(
    {
        items: [
            {
                type: "text",
                name: "exemplo_texto",
                label: "Exemplo de texto",
                required: true,
            },
            {
                type: "select",
                name: "exemplo_select",
                label: "Exemplo de seleção",
                required: false,
                options: [
                    {
                        value: "fortaleza",
                        label: "fortaleza",
                    },
                    {
                        value: "são paulo",
                        label: "são paulo",
                    },
                    {
                        value: "rio de janeiro",
                        label: "rio de janeiro",
                    },
                ],
            },
            {
                type: "multi-select",
                name: "exemplo_multi_select",
                label: "Exemplo de seleção múltipla",
                options: [
                    {
                        value: "fortaleza",
                        label: "fortaleza",
                    },
                    {
                        value: "são paulo",
                        label: "são paulo",
                    },
                    {
                        value: "rio de janeiro",
                        label: "rio de janeiro",
                    },
                ],
            },
            {
                type: "number",
                name: "exemplo_numero",
                label: "Exemplo de número",
            },
            {
                type: "decimal",
                name: "exemplo_decimal",
                label: "Exemplo de decimal",
            },
            {
                type: "date",
                name: "exemplo_data",
                label: "Exemplo de data",
            },
        ],
        type, // modal or drawer
        title: "Formulário de exemplo",
    },
    function (payload) {
        // Esse é o resultado do que o cliente preencheu
        console.log(payload)
    }
)
```

### Obter informações do workspace

Podemos a qualquer momento buscar as informações do ambiente passando um callback

```javascript
Kinbox.getWorkspaceInfo(function (payload) {
    console.log(payload)
})
```

No payload acima você recebe um objeto que contem os usuários, tags, grupos, campos customizados, etc.
Abaixo um exemplo do que vem no payload

```json
{
    "customFields": [
        {
            "options": null,
            "id": "2",
            "workspaceId": "1",
            "name": "Idade do cliente",
            "description": "Essa idade é do cliente",
            "entity": "contact",
            "placeholder": "idade",
            "position": null,
            "isDependent": null,
            "dependency": null,
            "type": "text",
            "isUniqueIdentifier": null,
            "isIntegration": true,
            "requiredToResolve": false,
            "resetOnNewCall": null,
            "isActive": true,
            "isDeleted": false,
            "invisible": true,
            "showAlways": null,
            "validate": null,
            "validation_mask": null,
            "validation_type": null,
            "updatedAt": "2023-10-27T16:32:09.724Z",
            "createdAt": "2023-10-27T16:32:09.724Z"
        }
    ],
    "members": [
        {
            "id": "1",
            "email": "fulano@gmail.com",
            "name": "Fulano",
            "avatar": null,
            "phone": "85999664487",
            "isActive": true,
            "customFields": {
                "idade": {
                    "value": "13"
                }
            },
            "lastLoginAt": "2024-02-28T00:03:01.156Z",
            "accessLevel": 10,
            "roleId": "2",
            "isOwner": false,
            "isJoined": true,
            "status": "online",
            "userConfigs": null,
            "isAvailable": true,
            "sharedFromIds": null,
            "workspaceId": "1",
            "onlineAt": "2024-02-28T17:28:44.135Z",
            "availabilityChangeReason": "auto",
            "ratingAverage": null
        }
    ],
    "tags": [
        {
            "id": "5",
            "workspaceId": "1",
            "name": "Tag1",
            "color": "#1abc9c",
            "textColor": "#fff",
            "isActive": true,
            "lastUpdateAt": "2023-11-06T12:58:20.420Z",
            "createdAt": "2019-08-13T00:07:58.921Z"
        }
    ],
    "groups": [
        {
            "id": "1",
            "workspaceId": "1",
            "name": "Grupo A",
            "icon": "#0079bf",
            "description": null,
            "externalData": null,
            "cep": null,
            "location": null,
            "ddd": "85",
            "customFields": null,
            "isActive": true,
            "lastUpdateAt": "2023-10-23T14:16:38.619Z",
            "createdAt": "2023-10-23T14:16:38.619Z",
            "members": ["14", "1", "8"]
        }
    ]
}
```

```javascript
function kinbox() {
    const listeners = []
    let savedCb = null
    function on(name, handler) {
        listeners.push({ name, handler })
    }

    function dispatchEvent(event, data) {
        const listener = listeners.find((x) => x.name === event)
        if (listener && typeof listener.handler === "function") {
            listener.handler(data)
        }
    }

    function dispatchMessage(event) {
        // window.parent.postMessage(event, "https://www.kinbox.com.br")
        window.parent.postMessage(event, "*")
    }

    function dialog(type, data, cb) {
        savedCb = cb
        dispatchMessage({ event: "dialog", data: { ...data, type } })
    }

    function toast(type, message) {
        dispatchMessage({ event: "toast", data: { message, type } })
    }

    function loading(isLoading) {
        dispatchMessage({ event: "loading", data: isLoading })
    }

    function setProperty(property) {
        dispatchMessage({ event: "set-property", data: property })
    }

    function addTag(tagId) {
        dispatchMessage({ event: "add-tag", data: tagId })
    }

    function removeTag(tagId) {
        dispatchMessage({ event: "remove-tag", data: tagId })
    }

    function assignTo(operatorId) {
        dispatchMessage({ event: "assign", data: operatorId })
    }

    function moveToGroup(groupId) {
        dispatchMessage({ event: "move", data: groupId })
    }

    function sendForm(form, cb) {
        savedCb = cb
        dispatchMessage({ event: "form", data: form })
    }

    function getWorkspaceInfo(cb) {
        savedCb = cb
        dispatchMessage({ event: "get-workspace-info" })
    }

    function onCallback(data) {
        if (typeof savedCb === "function") {
            savedCb(data)
            savedCb = null
        }
    }

    return {
        on,
        dialog,
        toast,
        dispatchEvent,
        setProperty,
        loading,
        addTag,
        removeTag,
        assignTo,
        moveToGroup,
        onCallback,
        sendForm,
        getWorkspaceInfo,
    }
}

window.Kinbox = new kinbox()

window.addEventListener("message", handleMessage, false)
function handleMessage(event) {
    const payload = event.data

    // if (event.origin != "h ttp://child.com") {
    //     return
    // }
    switch (payload.event) {
        case "conversation":
        case "no_conversation":
        case "callback":
            window.Kinbox.dispatchEvent(payload.event, payload.data)
            break
        case "dialog_confirm":
            window.Kinbox.onCallback(payload.data.confirmed)
        case "form_callback":
        case "get_workspace_info_callback":
            window.Kinbox.onCallback(payload.data)
    }
}
```
