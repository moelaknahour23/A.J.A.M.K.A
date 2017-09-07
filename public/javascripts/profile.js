//Alvin Ortega
//As soon as the page is done loading...
$(document).ready(function(){
    $("#profile-pic-modal").easyModal({
        overlayClose: false
    });
    prof_bindEditableElementEvents();

});

function prof_bindEditableElementEvents(){
    console.log('Setting up edit events...');

    var $profileEditables = $('.profile-editable');
    var $profileImageEditables = $('.profile-image-editable');

    $profileEditables.each(function(){
        var $editContent, $textarea, $updateButtons;
        var userid = parseInt($(this).data("userid"));
        var key = $(this).data("key");

        $editContent = $(this).find('.edit-content');
        $textarea = $(this).find('textarea');
        $updateButtons = $(this).find('.profile-button-update-set');
        $(this).find('.edit-button').click(function(){
            $editContent.hide();
            $textarea.val($editContent.text()).fadeIn();

            $updateButtons.fadeIn();
        });

        $(this).find('.profile-update-button').click(function(){
            var text = $textarea.val();
            var $self = $(this);
            var data ={
                reqType: 'update',
                id: userid,
                key: key,
                value: text
            };
            $updateButtons.hide();
            $.post('/usersapi/', data, function(data){
                console.log('Succesfully sent data to server');
            }).done(function(){
                $editContent.text(text);
                $editContent.fadeIn();
                $textarea.hide();
            }).fail(function(){
                console.log("Failed to update data on server");
                $updateButtons.show();
            });  
        });

        $(this).find('.profile-cancel-button').click(function(){
            $editContent.fadeIn();
            $textarea.hide();
            $updateButtons.hide();
        });
    });


    bindProfilePicModal();
    //TODO: Redundant, will fix way in the future ...
    //TODO: Modal does not reset on cancel
    $profileImageEditables.each(function(){
        var $editContent, $textarea, $updateButtons;
        var userid = parseInt($(this).data("userid"));
        var key = $(this).data("key");

        $editContent = $(this).find('.edit-content');
        var $textarea = $('#profile-pic-modal .edit-input');
        $(this).find('.edit-button').click(function(){
            $('#profile-pic-modal').trigger('openModal');
        });

        $('#profile-pic-modal .profile-update-button').click(function(){
            var text = $textarea.val();
            var data ={
                reqType: 'update',
                id: userid,
                key: key,
                value: text
            };
            $.post('/usersapi/', data, function(data){
                console.log('Succesfully sent data to server');
            }).done(function(){
                $editContent.attr('src', text);
                $('#profile-pic-modal').trigger('closeModal');
            }).fail(function(){
                console.log("Failed to update data on server");
            });  
        });

        $('#profile-pic-modal .profile-cancel-button').click(function(){
            $('#profile-pic-modal').trigger('closeModal');
        });
    });

    //TODO: Prevent profile pic loading when not being used!
    function bindProfilePicModal(){
        var $modalTextarea = $('#profile-pic-modal .edit-input');
        $('.profile-pic-select').click(function(){
            $modalTextarea.val($(this).attr('src'));
            clearSelections();
            $(this).addClass('selected');
        });

        function clearSelections(){
            $('.profile-pic-select').removeClass('selected');
        }
    }

}