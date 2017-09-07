var DEFAULT_CONTENT = 'Click to add new task';
var total_task_amt = 0;
var completed_task_amt = 0;

var currentListId = 1000;
var obj_listItems = {};
var arr_undoList = [];

function todo_init(){
    console.log('Initializing TodoList ...');
    setup_checkbox_action();
    setup_edit_labels();
    setup_sortable();
    setup_todo_retrieval();
    setup_todo_submission();
    setup_add_task();
    
    $('.dv-back-button').click(function(){
        clearDetailedView();
    })

    window.scrollTo(0,0);
}

function setup_checkbox_action(){
    $('.list-checkbox').each(function(index){
        $(this).click(function(){
            completeTask($(this).closest('.list-item'));
        });
    });
}

function setup_todo_retrieval(){
    var data ={
        reqType: 'get-todo'
    }
    $.post('/todoapi/', data, function(data){
        console.log('Succesfully sent todo set to server');
    }).done(function(data){
        bringInTodoSet(data);
    }).fail(function(){
        console.log("Failed to retreive todo on server");
    }); 
}

function bringInTodoSet(data){
    var data = data.json;
    var task;
    for(var i = 0; i < data.length; i++){
        task = createTaskObj(data[i].taskId, data[i].taskContent);
        task.complete = data[i].isDone;
        addNewTask(task);
    }

    window.scrollTo(0,0);
}

function setup_todo_submission(){
    $('.todo-submit').click(function(){
        var json = jsonify_todolist();
        var data ={
            reqType: 'insert-todo',
            json: json
        }
        console.log(data);
        var $self = $(this);
        $self.prop("disabled", true);
            $.post('/todoapi/', data, function(data){
                console.log('Succesfully sent todo set to server');
            }).done(function(){
                console.log("Success!");
                $self.html('<span>Saved!</span>');
                $self.prop("disabled", false);
            }).fail(function(){
                console.log("Failed to update todo on server");
                $self.html('<span>Save</span>');
                $self.prop("disabled", false);
            }); 
    });
}

function jsonify_todolist(){

    var json = [];

    //Get in progress items!
    $('.todo-inprogress-set .list-item').each(function(){
        var taskId =  $(this).data('listid');
        if(taskId){
            json.push({
                taskContent: $(this).find('.list-content').text(),
                isDone: 0,
                taskId: taskId
            });
        }
    });

    //Get complete items!!
    $('.todo-complete-set .list-item').each(function(){
        var taskId =  $(this).data('listid');
        if(taskId){
            json.push({
                taskContent: $(this).find('.list-content').text(),
                isDone: 1,
                taskId: taskId
            });
        }
    });

    return JSON.stringify(json);
}

function setup_add_task(){
    $('.add-task').blur(function(){
        if($(this).val()){
            addNewTask(createTaskObj(getNextListId(), $(this).val()));
        }
        $(this).val('');
    });
    
    $('.add-task').keypress(function(e){
        if(e.keyCode === 13){
            addNewTask(createTaskObj(getNextListId(), $(this).val()));
            $(this).val('');
         }
    });
}

function setup_edit_labels(){
    $('.edit-label').each(function(index){
        $(this).click(onclick);
        $(this).focus(onclick);
    });
    
    function onclick(){
        var textField = createInput('text');
        textField.value = $(this).text();
             $(textField).addClass('edit-label-field');
             $(textField).blur(function(){
                var li_content = document.createElement('div');
                $(li_content).addClass('list-content')
                    .text($(this).val()).click(onclick)
                    .attr('tabindex', 0).focus(onclick);
                 
                var item = $(this).parent();
                 
                obj_editTask(item.data('listid'), $(li_content).text());
                $(this).replaceWith(li_content);
             });
             $(this).replaceWith(textField);
             textField.focus();
             textField.select();
             $(textField).keypress(function(e){
                if(e.keyCode === 13){
                    $(this).trigger('blur');
                }
             });
    }
    
    function obj_editTask(listId, content){
        obj_listItems[listId].content = content;
    }
}

function setup_sortable(){
    $('.sortable').sortable({
        items: ".sort-list",
    });
}


function createInput(type){
    var field = document.createElement('input');
    field.setAttribute('type', type);
    return field;
}

function addNewTask(o_task){
    if(!o_task.content) o_task.content = DEFAULT_CONTENT;
    
    total_task_amt++;
    changePercent();
    
    //Get template of list item
    var template = $('#list-item-template').clone(true);
    
    
    if(o_task.due)
        $(template).find('.due-date-cue').addClass('alarm');
    $(template).appendTo('#todo-list .list').removeAttr('id');
    $(template).find('.list-content').text(o_task.content);
    $(template).attr('data-listid', o_task.listId);
    $(template).find('.list-delete-button').click(function(){
        $(template).toggle('drop', {direction: "down"}, 250, function(){
            var item = $(this).closest('.list-item');
            addToUndoList(item.data('listid'));
            item[0].parentElement.removeChild(item[0]);
            total_task_amt--;
            if(item.hasClass('completed-task')) completed_task_amt--;
            changePercent();
        });
    });
    $(template).find('.list-details-button').click(function(){
        var item = $(this).closest('.list-item');
        showDetailedView(item.data('listid'));
    });
    
    if(o_task.complete){
        $(template).prependTo('#done-todo-list').addClass('completed-task');
        completed_task_amt++;
        changePercent();
    }
    
    $(template).toggle('drop', {direction: "down"}, 250, function(){
        
    });
    return template;
}

function createTaskObj(listId, content){
    if(content != '')
        content = content.substr(0,1).toUpperCase() + content.substr(1);
    var obj_task = {
        listId: listId,
        content: content,
        complete: false,
        due: false
    }
    obj_listItems[listId] = obj_task;
        
    return obj_task;
}

//Item refers to list-item class!!!
function focusListItem(item){
    $(item).find('.list-content').trigger('focus');
}

function completeTask(item){
    if($(item).hasClass('completed-task')){
        $(item).toggle("drop", {direction: "up"}, 200, function(){
            $(item).appendTo($('#todo-list .list'));
            $(item).removeClass('completed-task');
            $(item).toggle("slide",  {direction: "down"}, 200);
            completed_task_amt--;
            changePercent();
            obj_completeTask(getListId(item), false);
        });
    } else {
        $(item).toggle("drop",  {direction: "down"}, 200,  function(){
            $(item).appendTo($('#done-todo-list'));
            $(item).addClass('completed-task');
            $(item).toggle("slide",  {direction: "up"}, 200);
        });
        completed_task_amt++;
        changePercent();
        obj_completeTask(getListId(item), true);
    }
    
    function obj_completeTask(listId, complete){
        if(complete)
            obj_listItems[listId].complete = true;
        else 
            obj_listItems[listId].complete = false;
    }
}

function changePercent(percent){
    if(percent == null){
        percent = Math.floor(completed_task_amt/total_task_amt * 100);
        if(percent < 0 || isNaN(percent)) percent = 0;
        percent = percent + "%";
    }
    
    $('.progress-bar').width(percent);
    $('.progress-amount').text(percent);
}

function getListId(item){
    return item.data('listid');
}

function getNextListId(){
    currentListId++;
    return currentListId;
}

function addToUndoList(listId){
    var item = obj_listItems[listId];
    arr_undoList.push(item);
    
    delete obj_listItems[listId];
    
    $('.undo-button').show();
}

function undoDelete(){
    var returningTask = arr_undoList.pop();
    var id = returningTask.listId;
    obj_listItems[id] = returningTask;
    addNewTask(obj_listItems[id]);
    if(arr_undoList.length <= 0) $('.undo-button').hide();
}

function populate(){
    addNewTask(createTaskObj(getNextListId(), "Pay the phone bill"));
    addNewTask(createTaskObj(getNextListId(), "Finish AJAMKA"));
    addNewTask(createTaskObj(getNextListId(), "Finish that one game"));
    addNewTask(createTaskObj(getNextListId(), "Return camera to friend"));
    addNewTask(createTaskObj(getNextListId(), "Deposit check in bank"));
}

function showDetailedView(listId){
    var obj = obj_listItems[listId];
    $('#todo-list .list').hide();
    $('#add-task-container').hide();
    $('.dv-task-title').text(obj.content);
    $('.dv-description').text(obj.description);
    
    if(obj.due){
        $('.dv-due-yes').addClass('dv-selected-date');
        $('.dv-due-date-text').show();
    }
    else
        $('.dv-due-no').addClass('dv-selected-date');
    
    $('.dv-due-yes').click(function(){
        $('.dv-due-date-text').show("drop"); 
        $(this).addClass('dv-selected-date');
        $('.dv-due-no').removeClass('dv-selected-date');
        obj.due = true;
        applyDueDateCue(listId);
    });
    
     $('.dv-due-no').click(function(){
        $('.dv-due-date-text').hide("drop");
        $(this).addClass('dv-selected-date');
        $('.dv-due-yes').removeClass('dv-selected-date');
        obj.due = false;
        removeDueDateCue(listId);
    });
    
    $('.detailed-view').show("fast");
}

function clearDetailedView(){
    $('.dv-description').text('');
    $('.detailed-view').hide("fast", function(){
            $('#todo-list .list').show();
            $('#add-task-container').show();
    });
    $('.dv-due-yes').off();
    $('.dv-due-no').off();
    $('.dv-due-yes').removeClass('dv-selected-date');
    $('.dv-due-no').removeClass('dv-selected-date');
    $('.dv-due-date-text').hide();
}

function applyDueDateCue(listId){
    var attr = '.list-item[data-listid="' + listId + '"] .due-date-cue';
    console.log($(attr)[0]);
    $(attr).addClass('alarm');
}

function removeDueDateCue(listId){
    var attr = '.list-item[data-listid="' + listId + '"] .due-date-cue';
    console.log($(attr)[0]);
    $(attr).removeClass('alarm');
}