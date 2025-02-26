import * as core from '@actions/core'
import * as github from '@actions/github'

function tgMd(text: string) {
  return text.replace(/([|{\[\]*_~}+)(#>!=\-.])/gm, '\\$1')
}

const jobStatus = core.getInput('job_status')
const botToken = core.getInput('bot_token', { required: true })
const chatId = core.getInput('chat_id', { required: true })
const message = core.getInput('message', { required: true })
const messageThreadId = core.getInput('message_thread_id')
const parseMode = core.getInput('parse_mode')
const disableWebPagePreview = core.getBooleanInput('disable_web_page_preview')
const disableNotification = core.getBooleanInput('disable_notification')

const githubUrl = github.context.serverUrl

const ref = github.context.ref
const { repo, owner } = github.context.repo
const runId = github.context.runId
const headCommitId = github.context.sha
const commitMessage = github.context.payload.head_commit?.message || ''

let text = ''

if (jobStatus) {
  if (jobStatus.toLowerCase() === 'success') {
    text += '✅ Success'
  } else if (jobStatus.toLowerCase() === 'cancelled') {
    text += '🗑️ Cancelled'
  } else if (jobStatus.toLowerCase() === 'failure' || jobStatus.toLowerCase() === 'failed') {
    text += '❌ Failed'
  } else {
    text += jobStatus
  }
  text += '\n\n'
}

text += `${message}\n\n`

if (parseMode === 'HTML') {
  text += `repository: <a href="${githubUrl}/${owner}/${repo}">${owner}/${repo}</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `repository: [${tgMd(owner)}/${tgMd(repo)}](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(
    repo
  )})\n`
}

text += `ref: ${ref}\n`

if (parseMode === 'HTML') {
  text += `<a href="${githubUrl}/${owner}/${repo}/actions/runs/${runId}">log</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `[log](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(repo)}/actions/runs/${runId})\n`
}
if (parseMode === 'HTML') {
  text += `commit: <a href="${githubUrl}/${owner}/${repo}/commit/${headCommitId}">${commitMessage}</a>\n`
} else if (parseMode === 'MarkdownV2') {
  text += `commit: [${tgMd(commitMessage)}](${tgMd(githubUrl)}/${tgMd(owner)}/${tgMd(
    repo
  )}/commit/${tgMd(headCommitId)})\n`
}

const requestBody = JSON.stringify({
  chat_id: chatId,
  text,
  message_thread_id: messageThreadId,
  parse_mode: parseMode,
  disable_web_page_preview: disableWebPagePreview,
  disable_notification: disableNotification,
})

const request = new Request(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: requestBody,
})

const response = await fetch(request)

if (!response.ok) {
  core.error(
    `Failed to send message: ${
      response.statusText
    } | response: ${await response.text()} | request: ${requestBody}`
  )
}
