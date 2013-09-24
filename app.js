//CopyRight Tag Solutions pvt.ltd 2013                                                                                              8
var express = require('express')
    , routes = require('./routes')
    , productRoutes = require('./routes/product')
    , login = require('./routes/login')
    , http = require('http')
    , path = require('path')
    , mongoose = require('mongoose');


var app = express();

var config = require('./config');

var User = require('./models/user');

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

//set up the passport

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findOne(id, function(err, user){
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: config.development.fb.appId,
    clientSecret: config.development.fb.appSecret,
    callbackURL: config.development.fb.url+ '/' +'fbauthed'
    },
    function(accessToken, refreshToken, profile, done){
        console.log ("accesToken ", accessToken);
        console.log ("refreshToken", refreshToken);
        console.log ("profile", profile);
        process.nextTick(function(){
            var query =  User.findOne({ 'fbId': profile.id });
            query.exec(function(err, oldUser){
               if (oldUser){
                   console.log('Existing User:' + oldUser.name + ' found and logged in!');
                   done(null, oldUser);
               }else{
                   var newUser = new User();
                   newUser.fbId = profile.id;
                   newUser.name = profile.displayName;
                   newUser.username = profile._json.username;
                   newUser.first_name = profile._json.first_name;
                   newUser.last_name = profile._json.last_name;
                   newUser.email = profile.emails[0].value;
                   newUser.bio = profile._json.bio;
                   newUser.gender = profile.gender;
                   newUser.birthday = profile._json.birthday;
                   newUser.hometown = profile._json.hometown.name;
                   newUser.location = profile._json.location.name;
                   newUser.friends = profile._json.friends;
                   newUser.favorite_teams = profile._json.favorite_teams;
                   newUser.save(function(err){
                       if(err) throw err;
                       console.log('New user: ' + newUser.first_name + ' created and logged in!');
                       done(null, newUser);
                   });
               }
            });
        });
    }
));

//Random Comment in file
// all environments
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({keepExtensions:true, uploadDir:path.join(__dirname,'public/images')}));
    app.use(express.session({ secret: '09efbe9a8a1fb61432451259ddc5bf76'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + "/public"));
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//mongoose.connect('mongodb://localhost/LSR');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Successfully mongodb is connected');
});

//console.log(productSchema.LatLng.latitude[0])

app.get('/', productRoutes.home);
app.get('/properties', productRoutes.index);
app.get('/properties/add', productRoutes.new);
app.post('/properties', productRoutes.create);
app.param('name', productRoutes.pass);
app.get('/properties/:name', productRoutes.show);
app.get('/properties/:name/edit', productRoutes.edit);
app.put('/properties/:name', productRoutes.update);
app.delete('/properties/:name', productRoutes.remove);


//Routing
app.get('/login', login.index );

app.get('/fbauth', passport.authenticate('facebook', { scope: ['email', 'user_birthday', 'user_likes', 'user_hometown', 'user_friends','read_stream'] }));
app.get('/fbauthed', passport.authenticate('facebook', {failureRedirect: '/'}), routes.loggedin);


app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

app.get('/settings', ensureAuthenticated,  function(req, res){
    res.render('settings');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}


