var express = require('express');
var router = express.Router();


// module.exports = function(router){
    router.get('/r1', function(req, res){
        console.log("들어옴")
        res.render('index');
    });

    router.get('/r2', function(req, res){
        res.render('index');
    });
// }

module.exports  = router; 