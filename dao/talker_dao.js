const db_manager = require('./db_manager');
// let Talker = require('../model/Talker');

class TalkerDao
{
    constructor(){
        this.TABLE_NAME = "talker";
        db_manager.tableExist(this.TABLE_NAME, (has)=>{
            console.log("has: ", has);
            if(!has){
                console.log("creating table cuz table not exist: " + this.TABLE_NAME);
                db_manager.runSqlCmd(
                    `CREATE TABLE talker(
                        id        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
                        name      CHAR(12)  NOT NULL,
                        datetime  DATETIME NOT NULL,
                        talked    BOOLEAN  DEFAULT false,
                        next_talk BOOLEAN  DEFAULT false
                    )`
                    , (err)=>{
                        if(err){
                            console.log("err: " , err);
                        }else{
                            console.log("table created: " + this.TABLE_NAME);
                        }
                    });
            }
        });   
    }
    
    insert(talker, ret_cb){
        // console.log("qqqqqq talker: ", talker);
        db_manager.runSqlCmd(`INSERT INTO talker (name, talked, datetime) VALUES (?, ?, (datetime('now', 'localtime')))`, [talker.name, talker.talked === 'true'], function(err, ret_info, self){
            console.log("self: ", self);
            console.log("ret_info: ", ret_info);
            
            if(err){
                console.log("err: ", err);
            }else{
                self.getOne(ret_info.inserted_id, ret_cb);
            }
        }, this);
    }

    delOne(id, ret_cb){
        db_manager.queryOneSqlCmd(`DELETE FROM talker WHERE id = ?`, [id] ,ret_cb);
    }

    getOne(id, ret_cb){
        db_manager.queryOneSqlCmd(`SELECT * FROM talker WHERE id = ?`, [id] ,ret_cb);
    }

    getAll(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM talker`, ret_cb);
    }

    getAllUntalked(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM talker WHERE talked = 0`, ret_cb);
    }

    updateUntalked(id, ret_cb){
        db_manager.runSqlCmd(`UPDATE talker SET talked = '1' WHERE id = ?`, [id], ret_cb);
    }

    resetTalked(ret_cb){
        db_manager.runSqlCmd(`UPDATE talker SET talked = '0'`, ret_cb);
    }
}


module.exports = new TalkerDao();