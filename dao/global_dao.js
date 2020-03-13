let DaoBase = require('./dao_base');


class GlobalDao extends DaoBase
{
    constructor(){
        super({db_name: "common", table_name: "global"});
        
        this.setupTable(`
            id        INTEGER   PRIMARY KEY  AUTOINCREMENT,
            name      CHAR(20)           NOT NULL,
            value     VARCHAR(255)       NOT NULL
        `); 
    }

    // If Not Exist
    updateNameValueINE(item, ret_cb){
        super.getOneSqlCmd("WHERE name = ?", [name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
                throw err;
            }else{
                if(one_item){
                    updateOneSqlCmd("SET value = ? WHERE name = ?", [item.value, item.name], ret_cb)
                }else{
                    insertOneSqlCmd("(name, value) VALUES (?, ?)", [item.name, item.value], ret_cb);
                }
            }
        });
    }

    insertNameValueINE(item, ret_cb){
        super.getOneSqlCmd("WHERE name = ?", [item.name], (err, one_item)=>{
            if(err){
                console.log("err: ", err);
                throw err;
            }else{
                if(!one_item){
                    super.insertOneSqlCmd("(name, value) VALUES (?, ?)", [item.name, item.value], ret_cb);
                }else{
                    ret_cb();
                }
            }
        });
    }

    getValByName(name, ret_cb){
        super.getOneSqlCmd("WHERE name = ?", [name] ,ret_cb)
    }

    delVal(name, ret_cb){
        super.delOneSqlCmd("WHERE name = ?", [name], ret_cb);
    }

    update(item, ret_cb){
        super.updateOneSqlCmd("SET name=?, value=? WHERE name=?", [item.name, item.value], ret_cb);
    }
}


module.exports = new GlobalDao();