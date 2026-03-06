<?php
/*
 * TextDrop — mail.php
 * Handles contact form submissions and sends email
 * using PHP's built-in mail() function.
 *
 * Receives POST: name, email, subject, message
 * Sends to: txtdropping@gmail.com
 *
 * © 2025 TextDrop. All rights reserved.
 *
 * ── SETUP NOTES ──────────────────────────────────
 * This file works on any shared hosting that has
 * PHP mail() enabled (cPanel, Hostinger, Namecheap etc.)
 *
 * For Gmail-based SMTP instead of mail(), you can use
 * PHPMailer (free) — see the commented section below.
 * ─────────────────────────────────────────────────
 */

/* Only allow POST requests */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

header('Content-Type: application/json');

/* ── Recipient ── */
define('RECIPIENT_EMAIL', 'txtdropping@gmail.com');
define('RECIPIENT_NAME',  'TextDrop');

/* ── Sanitize helper ── */
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

/* ── Collect & validate input ── */
$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$subject = clean($_POST['subject'] ?? 'Contact from TextDrop');
$message = clean($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

/* Limit subject length */
if (mb_strlen($subject) > 200) {
    $subject = mb_substr($subject, 0, 200);
}

/* ── Build email ── */
$to      = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
$headers = implode("\r\n", [
    'From: TextDrop Contact Form <' . RECIPIENT_EMAIL . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
]);

$body  = "You have received a new message via the TextDrop contact form.\n";
$body .= str_repeat('-', 50) . "\n\n";
$body .= "Name:    " . $name    . "\n";
$body .= "Email:   " . $email   . "\n";
$body .= "Subject: " . $subject . "\n\n";
$body .= "Message:\n";
$body .= $message . "\n\n";
$body .= str_repeat('-', 50) . "\n";
$body .= "Sent from: TextDrop Website\n";
$body .= "Time: " . date('Y-m-d H:i:s T') . "\n";

/* ── Send using PHP mail() ── */
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Mail server error. Please email us directly.']);
}
exit;

/*
 * ══════════════════════════════════════════════════
 * OPTIONAL: Use PHPMailer with Gmail SMTP
 * (more reliable than mail() on some hosts)
 *
 * 1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer
 * 2. Place PHPMailer files in a /phpmailer/ folder
 * 3. Uncomment and configure the block below
 * 4. Comment out the mail() block above
 *
 * ── Gmail app password ──
 * Go to: myaccount.google.com → Security → 2-Step → App Passwords
 * Generate a password for "Mail" and paste it below.
 * ══════════════════════════════════════════════════

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'txtdropping@gmail.com';
    $mail->Password   = 'YOUR_GMAIL_APP_PASSWORD';  // ← paste app password here
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('txtdropping@gmail.com', 'TextDrop Contact Form');
    $mail->addAddress('txtdropping@gmail.com', 'TextDrop');
    $mail->addReplyTo($email, $name);

    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Could not send: ' . $mail->ErrorInfo]);
}
*/
?>
