import * as core from '@actions/core'
import * as github from '@actions/github'

function tgMd(text: string) {
  return text.replace(/([|{\[\]*_~}+)(#>!=\-.])/gm, '\\$1')
}

const botToken = core.getInput('bot_token', { required: true })
const chatId = core.getInput('chat_id', { required: true })
const message = core.getInput('message', { required: true })
const messageThreadId = core.getInput('message_thread_id')
const parseMode = core.getInput('parse_mode')

const githubUrl = github.context.serverUrl

const ref = github.context.ref
const job = github.context.job
const { repo, owner } = github.context.repo
const runId = github.context.runId
const headCommitId = github.context.sha
const commitMessage = github.context.payload.head_commit?.message || ''

let text = ''

if (job === 'success') {
  text += '✅ Success'
} else if (job === 'cancelled') {
  text += '🗑️ Cancelled'
} else if (job === 'fail') {
  text += '❌ Failed'
} else {
  text += job
}

text += `\n`

if (parseMode === 'HTML') {
  text += `repository: <a href="${githubUrl}/${owner}/${repo}">${owner}/${repo}</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `repository: [${tgMd(owner)}/${tgMd(repo)}](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(
    repo
  )})\n`
}

text += `ref: ${ref}\n`

if (parseMode === 'HTML') {
  text += `log: <a href="${githubUrl}/${owner}/${repo}/actions/runs/${runId}">log</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `log: [log](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(repo)}/actions/runs/${runId})\n`
}
if (parseMode === 'HTML') {
  text += `commit: <a href="${githubUrl}/${owner}/${repo}/commit/${headCommitId}">${commitMessage}</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `commit: [${tgMd(commitMessage)}](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(
    repo
  )}/commit/${tgMd(headCommitId)})\n`
}

text += `\n${message}`

const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chat_id: chatId,
    text,
    message_thread_id: messageThreadId,
    parse_mode: parseMode,
    disable_web_page_preview: true,
  }),
})

if (!response.ok) {
  core.error(`Failed to send message: ${response.statusText} | ${await response.text()}`)
}
