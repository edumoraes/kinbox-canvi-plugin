(function () {
"use strict"

/* Estado e contexto (escopo privado) */
var conversation = null
var workspaceInfo = null

/* Constantes e endpoints (proxy genérico) */
var INVOICE_ENDPOINT = "/api/charges/pix" // Implementar no backend do parceiro

/* Utilidades */
function $(id) { return document.getElementById(id) }
function toCents(brl) {
	if (typeof brl !== "number") return 0
	return Math.round(brl * 100)
}
function uuid() {
	return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}
function setLoading(isLoading) {
	try { window.Kinbox && Kinbox.loading(isLoading) } catch (_) {}
	var btn = $("btnCriar")
	if (btn) btn.disabled = !!isLoading
}
function showResult(obj) {
	var el = $("result")
	if (!el) return
	el.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2)
}

/* Eventos Kinbox */
if (window.Kinbox && typeof Kinbox.on === "function") {
	Kinbox.on("conversation", function (data) {
		conversation = data
		var ctx = $("conversationCtx")
		if (ctx) ctx.textContent = `Contato: ${data?.contact?.name || "-"} (ID: ${data?.contact?.id || "-"}) | Conversa: ${data?.conversation?.id || "-"}`
		Kinbox.getWorkspaceInfo(function (info) { workspaceInfo = info })
	})
	Kinbox.on("no_conversation", function () {
		conversation = null
		var ctx = $("conversationCtx")
		if (ctx) ctx.textContent = "Sem conversa ativa"
	})
}

/* Formulário */
window.addEventListener("DOMContentLoaded", function () {
	var form = $("chargeForm")
	var btnSimular = $("btnSimular")
	if (form) form.addEventListener("submit", handleCreateCharge)
	if (btnSimular) btnSimular.addEventListener("click", simulateCharge)
})

function collectForm() {
	var valor = parseFloat($("valor").value)
	var vencimento = $("vencimento").value.trim()
	var descricao = $("descricao").value.trim()
	var tipo_transacao = $("tipo_transacao").value
	var identificador_externo = $("identificador_externo").value.trim() || uuid()
	var identificador_movimento = $("identificador_movimento").value.trim() || uuid()
	var texto_instrucao = $("texto_instrucao").value.trim()

	var cliente_nome = $("cliente_nome").value.trim()
	var cliente_email = $("cliente_email").value.trim()
	var cliente_tipo_documento = $("cliente_tipo_documento").value
	var cliente_numero_documento = $("cliente_numero_documento").value.trim()

	var body = {
		valor: toCents(isNaN(valor) ? 0 : valor),
		descricao,
		tipo_transacao,
		texto_instrucao,
		identificador_externo,
		identificador_movimento,
	}
	if (vencimento) body.vencimento = vencimento
	if (cliente_nome || cliente_email || cliente_numero_documento) {
		body.cliente = {
			nome: cliente_nome || undefined,
			"tipo_documento": cliente_tipo_documento,
			"numero_documento": cliente_numero_documento || undefined,
			"e-mail": cliente_email || undefined,
		}
	}
	return { body, meta: { valor, vencimento, descricao, tipo_transacao, identificador_externo, identificador_movimento, texto_instrucao } }
}

async function handleCreateCharge(e) {
	e.preventDefault()
	if (!conversation) {
		try { Kinbox.toast("warning", "Selecione uma conversa primeiro") } catch (_) {}
		return
	}
	var { body } = collectForm()
	setLoading(true)
	try {
		// Chama o backend do parceiro (proxy) que integra com o gateway
		var res = await fetch(INVOICE_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			credentials: "include",
		})
		var data
		try { data = await res.json() } catch (_) { data = { ok: res.ok, status: res.status } }
		if (!res.ok) throw new Error("Falha ao processar a cobrança")

		// Exibir apenas informações essenciais (sem detalhes internos)
		var essential = { status: "created", reference: body.identificador_externo, details: data?.data || null }
		showResult(essential)
		try { Kinbox.toast("success", "Cobrança criada") } catch (_) {}
		postChargeResultToConversation(essential)
	} catch (_) {
		showResult({ error: "Não foi possível criar a cobrança. Tente novamente." })
		try { Kinbox.toast("error", "Erro ao criar cobrança") } catch (_) {}
	} finally {
		setLoading(false)
	}
}

function simulateCharge() {
	var { body } = collectForm()
	var simulated = {
		status: "simulated",
		reference: body.identificador_externo,
		amount: body.valor,
		description: body.descricao,
	}
	showResult(simulated)
	if (window.Kinbox) {
		Kinbox.dialog(
			"confirm",
			{ title: "Enviar simulação na conversa?", description: "O resumo será copiado para você colar.", okText: "Copiar", cancelText: "Cancelar" },
			function (confirmed) {
				if (confirmed) {
					var text = JSON.stringify(simulated, null, 2)
					navigator.clipboard?.writeText(text)
					try { Kinbox.toast("info", "Resumo copiado") } catch (_) {}
				}
			}
		)
	}
}

function postChargeResultToConversation(data) {
	var contactName = conversation?.contact?.name || "contato"
	var texto = `Cobrança PIX criada para ${contactName}. Resumo:\n` + JSON.stringify(data)
	if (window.Kinbox) {
		Kinbox.dialog(
			"confirm",
			{ title: "Enviar na conversa?", description: "Copiar resumo para enviar na conversa.", okText: "Copiar", cancelText: "Fechar" },
			function (confirmed) {
				if (confirmed) {
					navigator.clipboard?.writeText(texto)
					try { Kinbox.toast("success", "Resumo copiado. Cole na conversa.") } catch (_) {}
				}
			}
		)
	}
}

})();
