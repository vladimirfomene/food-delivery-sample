/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

//Initialize Auth0 jwkcheck
var jwtCheck = jwt({
			secret: jwks.expressJwtSecret({
					cache: true,
					rateLimit: true,
					jwksRequestsPerMinute: 5,
					jwksUri: 'https://fomene.auth0.com/.well-known/jwks.json'
		}),
		audience: 'http://localhost:3000/api',
		issuer: 'https://fomene.auth0.com/',
		algorithms: ['RS256']
});

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);

	//Api
	app.get('/api/meals', jwtCheck, routes.api.meal.all);
	app.get('/api/meals/:id', jwtCheck, routes.api.meal.get);
	app.post('/api/meals', jwtCheck, routes.api.meal.create);
	app.put('/api/meals/:id', jwtCheck, routes.api.meal.update);
	app.delete('/api/meals/:id', jwtCheck, routes.api.meal.delete);
	app.post('/api/emails', jwtCheck, routes.api.email.create);
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
