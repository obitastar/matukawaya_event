<?php
/**
 * 来場予約フォーム送信処理
 * 設置先サーバーで mail() が使える前提
 */

// 許可するオリジン（公開後のURLに差し替え）
$allowed_origins = [
    'https://obitastar.github.io',
    'https://www.matukawaya.com',
    'http://localhost:3000',
    'http://localhost:5000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=UTF-8');

// プリフライトリクエスト
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// POST のみ許可
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// --- 設定 ---
$to = 'order@matukawaya.com';
$subject = '【来場予約】御福まつかわや 着物展示会';

// --- フォームデータ取得 ---
$name    = trim($_POST['name'] ?? '');
$tel     = trim($_POST['tel'] ?? '');
$email   = trim($_POST['email'] ?? '');
$date    = trim($_POST['date'] ?? '');
$time    = trim($_POST['time'] ?? '未選択');
$guests  = trim($_POST['guests'] ?? '未選択');
$message = trim($_POST['message'] ?? '');

// --- バリデーション ---
$errors = [];
if ($name === '') $errors[] = 'お名前が未入力です';
if ($tel === '')  $errors[] = '電話番号が未入力です';
if ($date === '') $errors[] = '来場希望日が未選択です';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// 電話番号の形式チェック
if (!preg_match('/^[0-9\-]+$/', $tel)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '電話番号の形式が不正です']);
    exit;
}

// メールアドレスの形式チェック（入力が��る場合のみ）
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'メールアドレスの形式が不正です']);
    exit;
}

// --- メール本文作成 ---
$body = <<<EOT
━━━━━━━━━━━━━━━━━━━━━━━━━━
　来場予約を受け付けました
━━━━━━━━━━━━━━━━━━━━━━━━━━

■ お名前
　{$name}

■ お電話番号
　{$tel}

■ メールアドレス
　{$email}

■ ご来場希望日
　{$date}

■ ご来場予定時間帯
　{$time}

■ 同伴人数
　{$guests}

■ メッセージ
　{$message}

━━━━━━━━━━━━━━━━━━━━━━━━━━
送信日時: EOT;
$body .= date('Y-m-d H:i:s');

// --- メール送信 ---
$headers = [
    'From: noreply@matukawaya.com',
    'Reply-To: ' . ($email !== '' ? $email : 'noreply@matukawaya.com'),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$result = mb_send_mail($to, $subject, $body, implode("\r\n", $headers));

if ($result) {
    echo json_encode(['success' => true, 'message' => '予約を受け付けました']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '送信に失敗しました。お電話でご連絡ください。']);
}
