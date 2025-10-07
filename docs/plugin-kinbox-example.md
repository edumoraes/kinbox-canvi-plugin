kinbox-plugin-example
Plugin de exemplo Kinbox

Nesse exemplo nós usamos o Github Pages para hospedar a página e acessamos através do seguinte endereço:

https://andrody.github.io/kinbox-plugin-example

É o endereço acima que deve ser colado no plugin do Kinbox


-- index.html

<!DOCTYPE html>
<html>
    <head>
        <script
            type="text/javascript"
            src="https://andrody.github.io/kinbox-lib/kinboxjs.js"
        ></script>
        <script type="text/javascript" src="plugin.js"></script>
    </head>
    <body>
        <p>
            <button onClick="loading()">Loading</button>
        </p>
        <p>
            <button onClick="dialog()">Dialog</button>
        </p>
        <p>
            <button onClick="toast()">Toast</button>
        </p>
        <p>
            <button onClick="changeCustomField()">Alterar campo (idade)</button>
        </p>
        <p>
            <button onClick="changeSessionCustomField()">Alterar campo de sessão (idade_sessao)</button>
        </p>
        <p>
            <button onClick="assign()">Atribuir a um operador</button>
        </p>
        <p>
            <button onClick="moveToGroup()">Mover para um grupo</button>
        </p>
        <p>
            <button onClick="addTag()">Adicionar uma tag</button>
        </p>
        <p>
            <button onClick="removeTag()">Remover uma tag</button>
        </p>
        <p>
            <button onClick="getWorkspaceInfo()">Obter info do ambiente</button>
        </p>
        <p>
            <button onClick="sendForm('modal')">Abrir formulário em modal</button>
        </p>
        <p>
            <button onClick="sendForm('drawer')">Abrir formulário em painel</button>
        </p>
        <p>
            <button onClick="getFacts()">Obter fatos sobre gatos</button>
        </p>
        <p >
            <ul id="facts">

            </ul>
        </p>
    </body>
</html>

-- plugin.js

/********************
 * Variáveis globais
 ********************/
var conversation
var workspaceInfo

/********************
 * Eventos
 ********************/

Kinbox.on("conversation", function (data) {
    conversation = data
    console.log("on conversation", data)

    getWorkspaceInfo()
})

Kinbox.on("no_conversation", function (data) {
    conversation = null
    console.log("on no-conversation", data)
})

Kinbox.on("callback", function (data) {
    console.log("on callback", data)
    if (data.key === "idade-changed") {
        Kinbox.loading(false)
        if (data.success) {
            Kinbox.toast("success", "Alterou idade com sucesso")
        } else {
            Kinbox.toast("error", "Erro ao alterar idade")
        }
    }
})

/********************
 * Exemplos
 ********************/
function loading() {
    Kinbox.loading(true)
    setTimeout(() => {
        Kinbox.loading(false)
    }, 2000)
}

async function dialog() {
    Kinbox.dialog(
        "confirm",
        {
            title: "Você confirma?",
            description: `Tem certeza que quer realizar essa ação??`,
            okText: "Confirmar",
            cancelText: "Cancelar",
        },
        async function (confirmed) {
            if (confirmed) {
                // Realizar alguma ação, como por exemplo uma requisição http
                Kinbox.toast("success", "Você realizou a ação com sucesso")
            } else {
                Kinbox.toast("error", "Você cancelou e não quis realizar a ação")
            }
        }
    )
}

async function toast() {
    Kinbox.toast("success", "Toast de sucesso")
    setTimeout(() => {
        Kinbox.toast("info", "Toast de info")
    }, 500)
    setTimeout(() => {
        Kinbox.toast("warning", "Toast de warning")
    }, 1000)
    setTimeout(() => {
        Kinbox.toast("error", "Toast de error")
    }, 1500)
}

async function changeCustomField() {
    // Estou supondo que existe um customField com o placeholder chamado "idade"
    const idadeAleatoria = Math.floor(Math.random() * (100 - 1 + 1) + 1) + ""

    Kinbox.loading(true)
    Kinbox.setProperty({
        key: "idade-changed",
        contactId: conversation.contact.id,
        fields: {
            idade: { value: idadeAleatoria },
        },
    })
}

async function changeSessionCustomField() {
    // Estou supondo que existe um customField de sessão com o placeholder chamado "idade"
    const idadeAleatoria = Math.floor(Math.random() * (100 - 1 + 1) + 1) + ""

    Kinbox.loading(true)
    Kinbox.setProperty({
        key: "idade-changed",
        type: "session",
        sessionId: conversation.session.id,
        fields: {
            idade_sessao: { value: idadeAleatoria },
        },
    })
}

function getFacts() {
    Kinbox.loading(true)

    fetch("https://meowfacts.herokuapp.com/?count=3")
        .then((res) => res.json())
        .then((res) => {
            document.getElementById("facts").innerHTML = res.data?.map((fact) => `<li>${fact}</li>`).join("")
            Kinbox.toast("success", "Fatos obtidos")
        })
        .finally(() => {
            Kinbox.loading(false)
        })
}

function assign() {
    Kinbox.assignTo(workspaceInfo?.members?.[0]?.id)
}

function moveToGroup() {
    Kinbox.moveToGroup(workspaceInfo?.groups?.[0]?.id)
}

function addTag() {
    Kinbox.addTag(workspaceInfo?.tags?.[0]?.id)
}

function removeTag() {
    Kinbox.removeTag(workspaceInfo?.tags?.[0]?.id)
}

function getWorkspaceInfo() {
    // Obter informações do workspace
    Kinbox.getWorkspaceInfo(async function (data) {
        console.log("on workspaceInfo", data)
        workspaceInfo = data
    })
}

function sendForm(type) {
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
                    name: "exemplo_date",
                    label: "Exemplo de data",
                },
            ],
            type, // modal or drawer
            title: "Formulário de exemplo",
        },
        function (payload) {
            console.log(payload)
        }
    )
}