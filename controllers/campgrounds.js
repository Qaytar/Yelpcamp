const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

//geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

//Renders index page of resource Campgrounds
module.exports.renderIndex = async (req, res) => {
    const allCamps = await Campground.find({})
    res.render('campgrounds/index', { allCamps })
}

//Renders form page to create new camp
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new',)
}
//Creates a new camp (using data from form)
module.exports.createNew = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp)
    req.flash('success', 'Succesfully created a new camp!');
    res.redirect(`/campgrounds/${newCamp.id}`);
}

//Renders show page of a camp
module.exports.renderShow = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
        .populate('author');

    if (!foundCamp) {
        req.flash('error', 'Cannnot find that campground :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCamp });
}

//Renders form page to edit a camp
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    if (!foundCamp) {
        req.flash('error', 'Cannnot find that campground :(');
        return res.redirect('/campgrounds');
    }
    //console.log('about to render edit form', foundCamp)
    res.render('campgrounds/edit', { foundCamp })
}
//Edits a camp (using data from form)
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const editedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    editedCamp.image.push(...imgs);
    await editedCamp.save();
    if (req.body.deleteImages) {
        for (let element of req.body.deleteImages) {
            await cloudinary.uploader.destroy(element);
        }
        await editedCamp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfully edited your camp!');
    res.redirect(`/campgrounds/${editedCamp.id}`)
}

//Deletes a camp
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted campground!');
    res.redirect(`/campgrounds`)
}