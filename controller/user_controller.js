let express = require("express");

let router = express.Router();


router.post("/", function(req, res){

});

router.get("/", function(req, res){
    res.render("login", {});
});

router.put("/", function(req, res){
    let req_data = req.body;
    console.log("req.body: ", req_data);

    if("admin" === req_data.username && "caojinhai007" === req_data.password){
        console.log("user logged in !");
        req.session.logged_in = true;
        res.json({success: true});
    }else{
        res.json({success: false});
    }
});


module.exports = router;