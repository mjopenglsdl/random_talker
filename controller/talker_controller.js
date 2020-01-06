let express = require('express');
let talker_dao = require('../dao/talker_dao');
let global_dao = require('../dao/global_dao');
let conf_manager = require('../lib/conf_manager');

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
            let b_logged_in = conf_manager.getConf().debug ? true : req.session.logged_in;
            res.json({success: true, logged_in:b_logged_in, data: row});
        }
    });
});

router.get("/", function(req, res){
    talker_dao.getAll((err, ary_talker)=>{
        if(err){
            console.log("err: ", err);
        }else{
            console.log(" rows: ", ary_talker);
            let b_logged_in = conf_manager.getConf().debug ? true : req.session.logged_in;
            res.json({success: true, logged_in:b_logged_in, data: ary_talker});
        }
    });
});


router.get("/next", function(req, res){
    global_dao.getVal("talker_id", (err, row)=>{
        if(err){
            console.log("  getVal talker_id failed");
            res.json({success: false});
        }else{
            console.log("row ", row);
            if(row){
                talker_dao.getOne(row.value , (err, talker_row)=>{
                    console.log("row ", talker_row);
                    res.json({success: true, data: {talker_name: talker_row.name}});
                });
            }
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
                        console.log("resp json: ", {success: true, id: ary_ids[rand_id], 
                                                talker_name: ary_talker[rand_id].name});
                        
                        res.json({success: true, data: {id: ary_ids[rand_id], talker_name: ary_talker[rand_id].name}});

                        global_dao.updateVal("talker_id", ary_ids[rand_id], (err)=>{
                            if(err){
                                console.log("  update failed");
                            }  
                        });

                    }else{
                        console.log("111 err: ", err);
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


router.delete("/", function(req, res){
 
    let req_data = req.body;
    console.log(" delete !!!   got talker data: ", req_data);

    talker_dao.delOne(req_data.id, ()=>{
        console.log("deleted !");
        res.json({success: true, data: {id: req_data.id}});
    });
});


module.exports = router;