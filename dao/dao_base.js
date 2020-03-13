const db_manager = require('./db_manager');


class DaoBase
{
    constructor(options){
        this.db_name = options.db_name;
        this.table_name = options.table_name;
    }

    setupTable(sql_table_schema){
        db_manager.setupDb(this.db_name);
        
        // create table if not exist        
        db_manager.runSqlCmd(this.db_name, "CREATE TABLE IF NOT EXISTS " + this.table_name + " (" + sql_table_schema + " )"
            , (err)=>{
                if(err){
                    console.log("err: " , err);
                    throw err;
                }else{
                    console.log("table created: " + this.table_name);
                }
        });
    }

    /// CRUD
    insertOneSqlCmd(sql_cmd_VALUES, param_list, ret_cb){
        db_manager.runSqlCmd(this.db_name, "INSERT INTO " + this.table_name + " " + sql_cmd_VALUES, param_list, ret_cb);
    }

    delOneSqlCmd(sql_cmd_WHERE, param_list, ret_cb){
        db_manager.runSqlCmd(this.db_name, "DELETE FROM " + this.table_name + " " + sql_cmd_WHERE, param_list, ret_cb);
    }

    getOneSqlCmd(sql_cmd_WHERE, param_list, ret_cb){
        db_manager.getOneSqlCmd(this.db_name, "SELECT * FROM " + this.table_name + " " + sql_cmd_WHERE, param_list, ret_cb);
    }

    updateOneSqlCmd(sql_cmd_SET_WHERE, param_list, ret_cb){
        db_manager.runSqlCmd(this.db_name, "UPDATE " + this.table_name + " " + sql_cmd_SET_WHERE, param_list, ret_cb);
    }

    // all
    getAllSqlCmd(ret_cb){
        db_manager.getOneSqlCmd(this.db_name, "SELECT * FROM " + this.table_name, ret_cb);
    }
}


module.exports = DaoBase;