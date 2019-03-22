var Email = require('keystone-email');

/** *
Send an email
===============
**/
exports.create = (req, res) => {
	new Email('order-email.pug', {
		transport: 'mailgun',
		root: 'templates/views/',
	}).send(
		{
			recipient: {
				firstName: 'Vladimir',
				lastName: 'Fomene',
			},
			orders: req.body.orders,
		},
		{
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN,
			to: 'vladimirfomene@gmail.com',
			from: {
				name: 'Food Delivery App',
				email: 'orders@food-delivery-sample.com',
			},
			subject: 'Urgent Food Order',
		},
		function (err, result) {
			if (err) {
				console.error('🤕 Mailgun test failed with error:\n', err);
			} else {
				console.log('📬 Successfully sent Mailgun test with result:\n', result);
			}
		}
	);
};
