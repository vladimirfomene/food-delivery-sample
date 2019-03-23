/* eslint-disable no-undef */
const basket = {};
const checkoutBtn = $('#btn-checkout');

// eslint-disable-next-line no-unused-vars
function addToBasket (meal) {

	if (meal in basket) {
		basket[meal] += 1;
	} else {
		basket[meal] = 1;
	}

	basket.count = 'count' in basket ? basket.count + 1 : 1;
	checkoutBtn.html('Checkout (' + basket.count + ')');
}

$('document').ready(function () {
	const apiUrl = 'http://localhost:3000/api';

	// create an Auth0 client
	const webAuth = new auth0.WebAuth({
		domain: 'fomene.auth0.com',
		clientID: 'TW8hW6p0Ss1gboLlGsS7y93c30jY64JZ',
		redirectUri: location.href,
		audience: 'http://localhost:3000/api',
		responseType: 'token id_token',
		scope: 'openid profile email',
		leeway: 60,
	});

	// select HTML elements to be manipulated
	const loginBtn = $('#btn-login');
	const logoutBtn = $('#btn-logout');
	const orderBtn = $('#btn-order');
	const promoView = $('.promo-message');
	const bodyView = $('body');
	const mainContainer = $('.container');
	const modalView = $('#checkoutModal');

	// add listeners to buttons
	loginBtn.click(() => webAuth.authorize());
	logoutBtn.click(logout);
	orderBtn.click(() => placeOrder());
	checkoutBtn.click(addOrdersToReceipt);


	let accessToken = null;
	let userProfile = null;

	handleAuthentication();
	controlDisplay();

	// function definitions
	function logout () {
		// Remove tokens and expiry time from browser
		accessToken = null;
		userProfile = null;
		controlDisplay();
	}

	function isAuthenticated () {
		return accessToken != null;
	}

	function handleAuthentication () {
		webAuth.parseHash(function (err, authResult) {
			if (authResult && authResult.accessToken) {
				window.location.hash = '';
				accessToken = authResult.accessToken;
				userProfile = authResult.idTokenPayload;

				// call api for meals on authentication
				getMenu();
				loginBtn.css('display', 'none');
				logoutBtn.css('display', 'inline-block');

			} else if (err) {
				console.log(err);
				alert(
					'Error: ' + err.error + '. Check the console for further details.'
				);
			}
			controlDisplay();
		});
	}

	function setupUrlAndReqheaders (endpoint, secured) {
		const url = apiUrl + endpoint;

		let headers;
		if (secured && accessToken) {
			headers = { Authorization: 'Bearer ' + accessToken };
		}

		return { url, headers };
	}

	function getMenu () {
		const { url, headers } = setupUrlAndReqheaders('/meals', true);
		$.ajax({
			type: 'GET',
			url: url,
			headers: headers,
			success: (data) => {
				renderMeals(data);
			},
			error: (data) => { console.log(data); },
		});
	}

	function placeOrder () {
		const { url, headers } = setupUrlAndReqheaders('/emails', true);

		$.ajax({
			type: 'POST',
			url: url,
			data: {
				orders: basket,
				email: userProfile.email,
				name: userProfile.name,
			},
			headers: headers,
			success: (data) => {
				var successView = $('#alert-success');
				successView.css('display', 'block');
				successView.text('Your email was sent successfully!');
				setTimeout(() => {
					successView.css('display', 'none');
					successView.text('');
				}, 30000);
			},
			error: (data) => {
				var errorView = $('#alert-danger');
				errorView.css('display', 'block');
				errorView.text('Your email was not sent.');
				setTimeout(() => {
					errorView.css('display', 'none');
					errorView.text('');
				}, 30000);
			},
		});

		// Close checkout modal on order btn is clicked.
		modalView.modal('hide');
	}


	function renderMeals (meals) {
		var mealContainer = $('#menu-view');

		// eslint-disable-next-line guard-for-in
		for (key in meals) {
			mealContainer.append('<div class="card col-md-4" style="width: 30rem;"><img src="'
				+ meals[key].image_url + '" class="card-img-top" alt="' + meals[key].title
				+ '"><div class="card-body"><h5 class="card-title">'
				+ meals[key].title + '</h5><p class="card-text">'
				+ meals[key].description + '</p><button onclick="addToBasket(\'' + meals[key].title + '\')" class="btn btn-primary">Order</button></div></div>');
		}
	}


	function controlDisplay () {
		if (isAuthenticated()) {
			loginBtn.css('display', 'none');
			logoutBtn.css('display', 'inline-block');
			checkoutBtn.css('display', 'inline-block');
			checkoutBtn.css('margin-left', 'auto');
			mainContainer.css('display', 'block');
			promoView.css('display', 'none');
			bodyView.css('background-image', 'none');
		} else {
			loginBtn.css('display', 'inline-block');
			logoutBtn.css('display', 'none');
			checkoutBtn.css('display', 'none');
			mainContainer.css('display', 'none');
			promoView.css('display', 'block');
			bodyView.css('background-image', 'url("/images/bg-home.jpg")');
		}
	}

	function addOrdersToReceipt () {
		var receiptBody = $('#receipt-body');
		receiptBody.empty();
		for (meal in basket) {
			if (meal !== 'count') receiptBody.append('<tr><td>' + meal + '</td><td>' + basket[meal] + '</td></tr>');
		}
	}

});
