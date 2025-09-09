<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$webhookUrl = 'https://discord.com/api/webhooks/1357808636533145760/l3YtcXmy4C_LFbMgtzgCoqjxoxSCz5zATNLB18dTKSUEJV5BPh_P9O-HWZ-IOwUd3FRH';
$recaptchaSecret = '6LepfAorAAAAAAb9CHadp2JP3byxkNl1q7B9mLo6';

$name    = htmlspecialchars(trim($_POST['name']));
$email   = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($_POST['subject']));
$message = htmlspecialchars(trim($_POST['message']));
$token   = $_POST['g-recaptcha-response'] ?? '';

if (!$name || !$email || !$subject || !$message || !$token) {
    http_response_code(400);
    exit('Invalid input');
}

// Verify reCAPTCHA
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$token}");
$response = json_decode($verify);

if (!$response->success || $response->score < 0.5) {
    http_response_code(403);
    exit('Captcha verification failed');
}

// Prepare Discord webhook payload
$payload = json_encode([
    'content' => "**New message**",
    'embeds' => [[
        'title' => $subject,
        'fields' => [
            ['name' => 'Name', 'value' => $name, 'inline' => true],
            ['name' => 'Email', 'value' => $email, 'inline' => true],
            ['name' => 'Message', 'value' => $message],
        ],
        'color' => 5814783
    ]]
]);

// Send to Discord webhook
$ch = curl_init($webhookUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    header('Location: /?sent=true');
    exit();
} else {
    header('Location: /?sent=false');
    exit();
}

