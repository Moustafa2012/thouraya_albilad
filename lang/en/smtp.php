<?php

return [
    'test_email' => [
        'subject' => 'SMTP Test Email',
        'title' => 'Your mail server<br><em>is working perfectly.</em>',
        'greeting' => 'Hi :name,',
        'confirmation' => 'This message confirms that your SMTP configuration in <strong>:app</strong> is set up correctly and outbound email delivery is functioning as expected.',
        'delivery_confirmed' => 'Delivery confirmed',
        'delivery_message' => 'This test was initiated from your application\'s settings panel. No further action is required on your part.',
        'status' => 'STATUS',
        'delivered' => '✓ Delivered',
        'sent_at' => 'SENT AT',
        'initiated_by' => 'INITIATED BY',
        'settings_panel' => 'Settings Panel',
        'ignore_message' => 'If you did not request this test, you can safely ignore this message. It was sent only to verify connectivity and will not recur unless triggered again.',
        'footer' => '&copy; :year :app &middot; Automated system message &middot; Do not reply',
        'configuration_label' => 'SMTP CONFIGURATION',
    ],
];
