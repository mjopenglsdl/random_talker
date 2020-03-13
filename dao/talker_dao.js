let DaoBase = require('./dao_base');


class TalkerDao extends DaoBase
{
    constructor(){
        super({db_name: "common", table_name: "talker"});

        this.setupTable(`
            id        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
            name      CHAR(12)  NOT NULL,
            datetime  DATETIME NOT NULL,
            talked    BOOLEAN  DEFAULT false,
            next_talk BOOLEAN  DEFAULT false
        `);
    }
    
    insert(talker, ret_cb){
        super.insertOneSqlCmd("(name, talked, datetime) VALUES (?, ?, (datetime('now', 'localtime')))", [talker.name, talker.talked === 'true'], function(err, ret_info, self){
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
        super.delOneSqlCmd("WHERE id = ?", [id], ret_cb);
    }

    getOne(id, ret_cb){
        super.getOneSqlCmd("WHERE id = ?", [id], ret_cb);
    }

    getAll(ret_cb){
        super.getAllSqlCmd(ret_cb);
    }

    getAllUntalked(ret_cb){
        db_manager.queryAllSqlCmd(`SELECT * FROM talker WHERE talked = 0`, ret_cb);
    }

    updateUntalked(id, ret_cb){
        super.updateOneSqlCmd("SET talked = '1' WHERE id = ?", [id], ret_cb);
    }

    resetTalked(ret_cb){
        super.updateOneSqlCmd("SET talked = '0'", ret_cb);
    }
}


module.exports = new TalkerDao();