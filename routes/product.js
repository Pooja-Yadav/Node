//CopyRight Tag Solutions pvt.ltd 2013
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , path = require('path');

var propertySchema = new Schema({
    productType: String,
    productName: String,
    productPrice: Number,
    productIsAvaliable: Boolean,
    type: Array,
    price: Number,
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    amenities: Array,
    comments_from_user: Array,
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    LatLng: {
        latitude: Number,
        longitude: Number
    },
    picture:String
});

var propertyModel = mongoose.model('Property', propertySchema);

exports.index = function (req, res) {
    propertyModel.find({}, function (err, docs) {
        if (err) return res.render('Error occurred');
        res.render('index', {products: docs, routePath: "prod", title: 'Product List - By Sandeep Pagi'});
    });
};

exports.new = function (req, res) {
    res.render("index", {routePath: "Add", title: 'Add New Product - By Sandeep Pagi'});
};

exports.create = function (req, res) {
    var temp = req.body;
    new propertyModel({
        productType: temp.productType,
        productName: temp.productName,
        productPrice: temp.productPrice,
        productIsAvaliable: temp.productIsAvaliable,
        type: temp.type,
        price: temp.price,
        bedrooms: temp.bedrooms,
        bathrooms: temp.bathrooms,
        area: temp.area,
        amenities: temp.amenities,
        comments_from_user: temp.comments_from_user,
        address: {
            line1: temp.line1,
            line2: temp.line2,
            city: temp.city,
            state: temp.state,
            country: temp.country,
            zip: temp.zip
        },
        LatLng: {
            latitude: temp.latitude,
            longitude: temp.longitude
        }
    }).save(function (err, product) {
            if (err) res.json(err)
            res.redirect('/properties/' + temp.productName)
        });
};

exports.pass = function (req, res, next, name) {
    propertyModel.find({productName: name}, function (err, docs) {
        req.product = docs[0];
        next();
    });
};

exports.show = function (req, res) {
    var  pic=path.join('/images',path.basename(req.product.picture));
    res.render('index', { product: req.product,  routePath: "Show", title: 'Edit Product - By Sandeep Pagi' });
};

exports.edit = function (req, res) {
    res.render('index', { product: req.product, routePath: "Edit", title: 'Update Product - By Sandeep Pagi'});
};

exports.update = function (req, res) {
    var b = req.body;
    var link = req.files.picture.path;
    var baseNmae = path.basename(link);
    console.log( "Full path -- "  + link );
    console.log("BaseNmae path -- " + baseNmae);
    var joinedPath = '/images/' + baseNmae;
    console.log("Joined path --> "+ joinedPath);
    propertyModel.update(
        { productName: req.params.name},
        { productName: b.name,
            type: b.type,
            price: b.price,
            bedrooms: b.bedrooms,
            bathrooms: b.bathrooms,
            area: b.area,
            amenities: b.amenities,
            comments_from_user: b.comments_from_user,
            address: {
                line1: b.line1,
                line2: b.line2,
                city: b.city,
                state: b.state,
                country: b.country,
                zip: b.zip
            },
            LatLng: {
                latitude: b.latitude,
                longitude: b.longitude
            },
            picture: joinedPath
        },
        function (err) {
            res.redirect('/properties/' + b.name);
        }
    );
};

exports.remove = function (req, res) {
    propertyModel.remove(
        {productName: req.params.name},
        function (err) {
            res.redirect('/properties');
        });
};

exports.home = function (req, res) {
    propertyModel.find({}, function (err, docs) {
        if (err) return res.render('Error occurred');
        res.render('index', {products: JSON.stringify(docs), routePath: "home", title: 'Product List - By Sandeep Pagi'});
    });
};

