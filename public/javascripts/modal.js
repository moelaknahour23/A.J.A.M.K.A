$(document).ready(function(){
    $("#myModal").easyModal({

    });
});

function openModal(title, msg){
    console.log("Opening modal...");
    var $modal = $('#myModal');
    $modal.trigger('openModal');
    $modal.find('.modal-title').text(title);
    $modal.find('.modal-content').text(msg);
}