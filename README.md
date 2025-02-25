# Telegram Notification Action

A GitHub Action for sending customized notifications to Telegram chats or channels about your workflow status.

## Description

This action allows you to send detailed notifications to Telegram about your GitHub workflow runs. It automatically includes relevant information such as repository name, commit details, workflow status, and links to logs, along with your custom message.

## Benefits

- 🚀 **Easy Integration**: Simple setup with minimal configuration required
- 🔔 **Real-time Notifications**: Get instant updates about your workflow status
- 📊 **Detailed Context**: Automatically includes repository, commit, and workflow information
- 🎨 **Formatting Options**: Supports Telegram's MarkdownV2 and HTML formatting
- 🧵 **Topic Support**: Compatible with Telegram's topic threads in groups
- 🔒 **Secure**: Uses GitHub Secrets for sensitive information

## Usage

Add the following to your GitHub workflow file:

```yaml
- name: Send Telegram Notification
  uses: an3park/telegram-action@v1
  if: always()
  with:
    bot_token: ${{ secrets.BOT_TOKEN }}
    chat_id: ${{ secrets.CHAT_ID }}
    message: 'Build completed successfully!'
```

## Inputs

| Input               | Description                                                 | Required | Default    |
| ------------------- | ----------------------------------------------------------- | -------- | ---------- |
| `bot_token`         | Telegram Bot API token                                      | Yes      | -          |
| `chat_id`           | Target chat ID or channel username (e.g., @channelusername) | Yes      | -          |
| `message_thread_id` | ID for the target message thread (for forum supergroups)    | No       | -          |
| `message`           | Custom message text to be sent                              | Yes      | -          |
| `parse_mode`        | Mode for parsing entities in the message text               | No       | MarkdownV2 |

## Examples

### Basic Usage

```yaml
name: Build and Notify

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build project
        run: npm ci && npm run build

      - name: Send Telegram Notification
        uses: an3park/telegram-action@v1
        if: always()
        with:
          bot_token: ${{ secrets.BOT_TOKEN }}
          chat_id: ${{ secrets.CHAT_ID }}
          message: 'Build status: ${{ job.status }}'
```

### With HTML Formatting

```yaml
- name: Send Telegram Notification with HTML
  uses: an3park/telegram-action@v1
  if: always()
  with:
    bot_token: ${{ secrets.BOT_TOKEN }}
    chat_id: ${{ secrets.CHAT_ID }}
    parse_mode: 'HTML'
    message: "<b>Deployment ${{ job.status }}!</b>\n<i>Environment</i>: Production"
```

### Sending to a Topic Thread

```yaml
- name: Send Telegram Notification to Topic
  uses: an3park/telegram-action@v1
  if: always()
  with:
    bot_token: ${{ secrets.BOT_TOKEN }}
    chat_id: ${{ secrets.CHAT_ID }}
    message_thread_id: ${{ secrets.THREAD_ID }}
    message: 'Release status: ${{ job.status }}'
```

## Setting Up a Telegram Bot

1. Start a chat with [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` and follow the instructions to create a new bot
3. Copy the API token provided by BotFather
4. Add the bot to your group or channel
5. For groups, get the chat ID by sending a message and checking the chat ID via the Telegram API
6. For channels, use the channel username with @ prefix (e.g., @mychannel)

## License

MIT

## Author

an3park
