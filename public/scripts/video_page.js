

$("#like").click(() => {
    console.log("like clicked!");
    
    $.post(`/video_routes/like/${video_id}`, {}, (data) => {
        console.log(data);
    }); 
}); 
