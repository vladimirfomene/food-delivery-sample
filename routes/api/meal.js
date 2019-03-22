var keystone = require('keystone');
var Meal = keystone.list('Meal');

/** *
List Meals
===============
**/
exports.all = (req, res) => {
	Meal.model.find((err, meals) => {
		if (err) return res.json({ err: err });

		res.json(meals);
	});
};

/** *
Get a meal
===============
**/
exports.get = (req, res) => {
	Meal.model.findById(req.params.id).exec((err, meal) => {
		if (err) return res.json(err);
		if (!meal) return res.status(404).send('No meal with that ID');
		res.json({ meal: meal });
	});
};

/** *
Create a meal
===============
**/
exports.create = (req, res) => {
	if (typeof req.body.title !== 'string')
		{ return res.status(400).send('Title is invalid'); }

	if (typeof req.body.description !== 'string')
		{ return res.status(400).send('Description is invalid'); }

	if (typeof req.body.image_url !== 'string')
		{ return res.status(400).send('Image url is invalid'); }

	var newMeal = new Meal.model({
		title: req.body.title,
		description: req.body.description,
		image_url: req.body.image_url,
	});

	newMeal.save((err, meal) => {
		if (err) return res.json(err);

		return res.status(201).json(meal);
	});
};

/** *
Delete a meal
===============
**/
exports.delete = (req, res) => {
	Meal.model.findById(req.params.id).remove(err => {
		if (err) return res.json(err);
		res.status(200).json({ msg: 'Meal deleted successfull' });
	});
};

/** *
Update a meal
===============
**/
exports.update = (req, res) => {
	Meal.model.findById(req.params.id).exec((err, meal) => {
		if (err) return res.json(err);
		if (!meal) return res.status(404).send('No meal with that ID');


		var data = req.method === 'PUT' ? req.body : req.query;

		meal.getUpdateHandler(req).process(data, err => {
			if (err) return res.json(err);
			res.json(meal);
		});
	});
};
