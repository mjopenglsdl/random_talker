const os = require('os');
const fs = require('fs');
const process = require('process');
const sqlite3 = require('sqlite3').verbose();


class DbManager
{
    constructor(){
        this.db_dir = os.homedir() + "/.sqlitedb";
        console.log("db_dir: ", this.db_dir);
        if(!fs.existsSync(this.db_dir)){
            fs.mkdirSync(this.db_dir);
        }
        
        this.dbs = {};
    }

    setupDb(db_name){
        if(!this.dbs.hasOwnProperty(db_name)){
            this.dbs[db_name] = new sqlite3.Database(this.db_dir + "/" + db_name + ".db", ()=>{
                console.log("db loaded !");
            });
        }
    }

    tableExist(db_name, table_name, ret_cb){
        this.setupDb(db_name);
        this.dbs[db_name].serialize(()=>{
            this.dbs[db_name].get("SELECT * FROM sqlite_master WHERE type='table' AND name=?", table_name, function (err, row) {
                // console.log("row: ", row, ", err: ", err);
                if(!row){
                    // console.log("table not exist");
                    ret_cb(false);
                }else{
                    // console.log("table exist !");
                    ret_cb(true);
                }
            });
        });
    }

    runSqlCmd(db_name, str_cmd, param2, param3, param4){ 
        // console.log("typeof param2: ", typeof param2 ); 
        // console.log("typeof param2.isArray: ", param2.isArray ); 
        // console.log("typeof param3: ", typeof param3 ); 
        // console.log("param4: ", param4);

        let ary_param = [];
        if(typeof param2 == "object" && Array.isArray(param2)){
            ary_param = param2;
        }

        let ret_cb;
        if(typeof param2 === "function"){
            ret_cb = param2;
        }else if(typeof param3 === "function"){
            ret_cb = param3;
        }

        this.dbs[db_name].serialize(()=>{
            // console.log("000 runSqlCmd() ", str_cmd, ", ", ary_param, ", ret_cb: ", ret_cb);
            if(param4){
                this.dbs[db_name].run(str_cmd, ary_param, function(err){
                    ret_cb(err, {inserted_id: this.lastID, changed: this.changed}, param4);
                });
            }else{
                if(ret_cb){
                    this.dbs[db_name].run(str_cmd, ary_param, ret_cb);
                }else{
                    this.dbs[db_name].run(str_cmd, ary_param);
                }
            }
        });
    }
    
    queryAllbyConCmd(db_name, str_cmd, condition, ret_cb){
        this.dbs[db_name].serialize(()=>{
            this.dbs[db_name].all(str_cmd, condition, ret_cb);
        });
    }
    
    getOneSqlCmd(db_name, str_cmd, param, ret_cb){ 
        // console.log("getOneSqlCmd: ", str_cmd, ", param: ", param);
        this.dbs[db_name].serialize(()=>{
            if(ret_cb){
                this.dbs[db_name].get(str_cmd, param, ret_cb);
            }else{
                this.dbs[db_name].get(str_cmd);
            }
        });
    }

    queryAllSqlCmd(db_name, str_cmd, param, ret_cb){
        if(3 == arguments.length){
            this.dbs[db_name].serialize(()=>{
                // console.log("000 runSqlCmd() ", str_cmd, ", ret_cb: ", ret_cb);
                this.dbs[db_name].all(str_cmd, param, ret_cb);
            });
        }else if(2 == arguments.length){
            this.dbs[db_name].serialize(()=>{
                // console.log("000 runSqlCmd() ", str_cmd, ", ret_cb: ", ret_cb);
                if(typeof param == "function"){
                    this.dbs[db_name].all(str_cmd, param);
                }
            });
        }
    }

    close(){
        for (const key in this.dbs) {
            if (this.dbs.hasOwnProperty(key)) {
                let ele = this.dbs[key];
                ele.close();
            }
        }
        console.log(" db closed !");
    }
}


let db_mgr = new DbManager();

process.on("SIGINT", ()=>{
    db_mgr.close();
    process.exit();
});


module.exports = db_mgr;