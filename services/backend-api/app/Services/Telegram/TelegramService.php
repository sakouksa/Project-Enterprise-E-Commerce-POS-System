<?php

namespace App\Services\Telegram;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private ?string $botToken;
    private string $baseUrl;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token') ?: env('TELEGRAM_BOT_TOKEN');
        $this->baseUrl = "https://api.telegram.org/bot{$this->botToken}";
    }

    public function isConfigured(): bool
    {
        return !empty($this->botToken) && $this->botToken !== 'your-telegram-bot-token';
    }

    /**
     * Send text message to a chat.
     */
    public function sendMessage(
        int|string $chatId,
        string $text,
        ?array $replyMarkup = null,
        string $parseMode = 'HTML'
    ): array {
        if (!$this->isConfigured()) {
            Log::info("[Mock Telegram] sendMessage to {$chatId}: " . strip_tags($text));
            return ['ok' => true, 'mock' => true];
        }

        $payload = [
            'chat_id'    => $chatId,
            'text'       => $text,
            'parse_mode' => $parseMode,
        ];

        if ($replyMarkup) {
            $payload['reply_markup'] = json_encode($replyMarkup);
        }

        try {
            $response = Http::timeout(10)->post("{$this->baseUrl}/sendMessage", $payload);
            return $response->json() ?? ['ok' => false];
        } catch (\Throwable $e) {
            Log::error("Telegram sendMessage error: " . $e->getMessage());
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Send photo with caption.
     */
    public function sendPhoto(
        int|string $chatId,
        string $photoUrl,
        string $caption = '',
        ?array $replyMarkup = null
    ): array {
        if (!$this->isConfigured()) {
            Log::info("[Mock Telegram] sendPhoto to {$chatId}: {$photoUrl}");
            return ['ok' => true, 'mock' => true];
        }

        $payload = [
            'chat_id'    => $chatId,
            'photo'      => $photoUrl,
            'caption'    => $caption,
            'parse_mode' => 'HTML',
        ];

        if ($replyMarkup) {
            $payload['reply_markup'] = json_encode($replyMarkup);
        }

        try {
            $response = Http::timeout(10)->post("{$this->baseUrl}/sendPhoto", $payload);
            return $response->json() ?? ['ok' => false];
        } catch (\Throwable $e) {
            Log::error("Telegram sendPhoto error: " . $e->getMessage());
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Answer callback query (for inline button clicks).
     */
    public function answerCallbackQuery(string $callbackQueryId, string $text = '', bool $showAlert = false): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => true];
        }

        try {
            $response = Http::timeout(5)->post("{$this->baseUrl}/answerCallbackQuery", [
                'callback_query_id' => $callbackQueryId,
                'text'              => $text,
                'show_alert'        => $showAlert,
            ]);
            return $response->json() ?? ['ok' => false];
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Register webhook URL with Telegram.
     */
    public function setWebhook(string $url, ?string $secretToken = null): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => false, 'message' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        $payload = ['url' => $url];
        if ($secretToken) {
            $payload['secret_token'] = $secretToken;
        }

        $response = Http::timeout(10)->post("{$this->baseUrl}/setWebhook", $payload);
        return $response->json() ?? ['ok' => false];
    }

    /**
     * Delete webhook.
     */
    public function deleteWebhook(): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => false, 'message' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        $response = Http::timeout(10)->post("{$this->baseUrl}/deleteWebhook");
        return $response->json() ?? ['ok' => false];
    }

    /**
     * Get current webhook info.
     */
    public function getWebhookInfo(): array
    {
        if (!$this->isConfigured()) {
            return ['ok' => false, 'message' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        $response = Http::timeout(10)->get("{$this->baseUrl}/getWebhookInfo");
        return $response->json() ?? ['ok' => false];
    }
}
