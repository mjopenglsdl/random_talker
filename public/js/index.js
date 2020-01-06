$(document).ready(()=>{

    del_item = function(id){
        $.ajax({
            type: "DELETE",
            url: "/talker",
            data: {id: id},
            dataType: "json",
            success: function(data, textStatus){
                console.log("!!! data: ", data);
                if(true === data.success){
                    // reset
                    // console.log("deleted !!!");
                    $("#tr_"+ data.data.id).remove();
                }
            }
        });
    }

    // get table data
    $.ajax({
        type: "GET",
        url: "/talker",
        data: {},
        dataType: "json",
        success: function(ret_data, textStatus){
            console.log("data: ", ret_data);
            ret_data.data.forEach(element => {
                var append_data = "";
                append_data += "<tr id='tr_" + element.id +"'>";
                append_data += "<td>" + element.id + "</td>";
                append_data += "<td>" + element.name + "</td>";
                append_data += "<td>" + element.datetime + "</td>";
                append_data += "<td>" + element.talked + "</td>";
                if(ret_data.logged_in){
                    append_data += "<td>" + 
                    "<button id='"+element.id+"'class='delbtn ui-btn ui-btn-danger'>del</button>" +
                    "</td>";
                }

                append_data += "</tr>";
                $("tbody").append(append_data);
            });

            // reg cb
            $("button.delbtn").click(function(){
                console.log("clicked: ", $(this).attr("id"));
                del_item($(this).attr("id"));
            });
        }
    });

    // get next talker name
    $.ajax({
        type: "GET",
        url: "/talker/next",
        data: {},
        dataType: "json",
        success: function(ret_data, textStatus){
            console.log("data: ", ret_data);
            if(ret_data.success){
                $("#next_talker_name").text(ret_data.data.talker_name);
            }
        }
    });

    $("#add_talker").click(function(){
        var data_tobe_sent = {name: $("#talkername").attr("value"), talked: $("#talked").attr("checked")};
        console.log("add_talker!, data_tobe_sent: ", data_tobe_sent);
        
        $.ajax({
            type: "POST",
            url: "/talker",
            data: data_tobe_sent,
            dataType: "json",
            success: function(ret_data, textStatus){
                console.log("data: ", ret_data);
                var append_data = "";
                append_data += "<tr id='tr_" + ret_data.data.id +"'>";
                append_data += "<td>" + ret_data.data.id + "</td>";
                append_data += "<td>" + ret_data.data.name + "</td>";
                append_data += "<td>" + ret_data.data.datetime + "</td>";
                append_data += "<td>" + ret_data.data.talked + "</td>";
                if(ret_data.logged_in){
                    append_data += "<td id='' >" + 
                    "<button id='"+ret_data.data.id+"'class='delbtn ui-btn ui-btn-danger'>del</button>" +
                    "</td>";
                }
                append_data += "</tr>";
                $("tbody").append(append_data);
            }
        });
    });

    $("#to_next").click(function(){
        $.ajax({
            type: "PUT",
            url: "/talker",
            data: {},
            dataType: "json",
            success: function(ret_data, textStatus){
                console.log("!!! ret_data: ", ret_data);
                if(true === ret_data.success){
                    if(ret_data.data){
                        // console.log("+++ update: ", "#tr_"+ data.id );
                        // console.log("           ", $("#tr_"+ data.id) );
                        // console.log("           ", $("#tr_"+ data.id).find("td") );
                        $("#tr_"+ ret_data.data.id).find("td").eq(3).text("1");
                        $("#next_talker_name").text(ret_data.data.talker_name);
                    }else{
                        // reset
                        console.log("reset !!!      ", $("tbody").children("tr") );
                        $("#next_talker_name").text("");

                        $("tbody").children("tr").forEach((one_tr)=>{
                            console.log("one_tr: ", one_tr);
                            $(one_tr).find("td").eq(3).text("0");
                        });
                    }
                }
            }
        });
    });
});