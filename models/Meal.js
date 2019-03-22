var keystone = require('keystone');

/**
 * Meal Model
 * ==========
 */

var Meal = new keystone.List('Meal', {
	autokey: { path: 'slug', from: 'title', unique: true },
	map: { name: 'title' },
});

Meal.add({
	title: { type: String, required: true },
	description: { type: String, required: true, default: '' },
	image_url: { type: String, required: true, default: '' },
});

/**
 * Registration
 **/
Meal.register();
