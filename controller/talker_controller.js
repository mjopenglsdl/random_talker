let express = require('express');
let talker_dao = require('../dao/talker_dao');
let random_seed = require('random-seed');

let router = express.Router();
let rand_gen = random_seed.create(new Date().getMilliseconds());

router.post("/", function(req, res){
    let req_data = req.body;
    console.log("   got talker data: ", req_data);
    talker_dao.insert(req_data, function(err, row){
        if(err){
            console.log("err: ", err);
        }else{
            console.log("data inserted: row: ", row);
            res.json({success: true, logged_in:req.session.logged_in, data: row});
        }
    });
});

router.get("/", function(req, res){
    talker_dao.getAll((err, ary_talker)=>{
        if(err){
            console.log("err: ", err);
        }else{
            console.log(" rows: ", ary_talker);
            res.json({success: true, logged_in:req.session.logged_in, data: ary_talker});
        }
    });
});

router.put("/", function(req, res){
    talker_dao.getAllUntalked((err, ary_talker)=>{
        if(err){
            console.log("err: ", err);
        }else{
            console.log("ary_talker: ", ary_talker);
            let ary_ids = new Array;
            ary_talker.forEach(one_talker => {
                // console.log("one_talker: ", one_talker);
                ary_ids.push(one_talker.id);
            });

            if(ary_ids.length > 0){
                console.log("ary_ids: ", ary_ids);
                let rand_id = rand_gen.intBetween(0, ary_ids.length-1);
                console.log("rand_id: ", rand_id);
                talker_dao.updateUntalked(ary_ids[rand_id], (err)=>{
                    if(!err){
                        console.log("resp json: ", {success: true, id: ary_ids[rand_id]});
                        res.json({success: true, data: {id: ary_ids[rand_id]}});
                    }else{
                        console.log("err: ", err);
                        res.json({success: false});
                    }
                });

            }else{
            // reset
                talker_dao.resetTalked((err)=>{
                    if(err){
                        console.log("resetTalked failed: ", err);
                    }else{
                        console.log("resetTalked +++");
                        res.json({success: true});
                    }
                });
            }

        }
    });
});


module.exports = router;