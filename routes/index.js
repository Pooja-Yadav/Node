//CopyRight Tag Solutions pvt.ltd 2013

exports.index = function(req, res){
  res.render('index', { title: 'LSR', routePath: "home" });
};

exports.loggedin = function(req, res){
    res.render('loggedin', { title: 'LSR', user: req.user});
};