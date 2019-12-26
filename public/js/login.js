$(document).ready(()=>{
    $("#login").click(function(){
        $.ajax({
            type: "PUT",
            url: "/user",
            data: {username: $("#username").attr("value"), password: $("#password").attr("value")}, 
            success: function(data, textStatus){
                console.log("data: ", data);
                if(true === data.success){
                    console.log("+++");
                    $(location).prop('href', '/')
                }
            }
        });
    })
});