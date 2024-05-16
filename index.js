// Получение ссылки на шаблон по его id
var task_template = document.getElementById('template_task');
var tasks_panel = document.querySelector('#tasks_panel');
var none_task_template = document.querySelector('#none_task');
var dialog_create_template = document.querySelector('#create_dialog_template');
var dialog_edit_template = document.querySelector('#edit_dialog_template');

const openDialogButton = document.getElementById('openDialogCreateButton');
const clearTasksButton = document.getElementById('clearTasksButton');
const refreshTasksButton = document.getElementById('refreshTasksButton');

openDialogButton.addEventListener('click', openCreateDialog);
clearTasksButton.addEventListener('click', clear);
refreshTasksButton.addEventListener('click', drawTasks);

document.addEventListener("DOMContentLoaded", drawTasks)

function openCreateDialog(){
    var dialog_clone = document.importNode(dialog_create_template.content, true);
    document.body.classList.add('blur-background');
    document.body.appendChild(dialog_clone)

    document.body.querySelector("#create_dialog").querySelector("#closeDialogButton").addEventListener('click', closeCreateDialog)
    document.body.querySelector("#create_dialog").querySelector("#createTaskDialogButton").addEventListener('click', function(){
        const input_title = document.body.querySelector("#create_dialog").querySelector("#task_title");
        const textarea_description = document.body.querySelector("#create_dialog").querySelector("#task_description");
        addTask({title: input_title.value, description: textarea_description.value})
        closeCreateDialog();
    })
}

function openEditDialog(task){
    var dialog_clone = document.importNode(dialog_edit_template.content, true);
    document.body.classList.add('blur-background');
    document.body.appendChild(dialog_clone);
    let input_title = document.body.querySelector("#edit_dialog").querySelector("#task_title");
    let textarea_description = document.body.querySelector("#edit_dialog").querySelector("#task_description");
    input_title.value = task.title;
    textarea_description.value = task.description;

    document.body.querySelector("#edit_dialog").querySelector("#closeDialogButton").addEventListener('click', closeEditDialog)
    document.body.querySelector("#edit_dialog").querySelector("#editTaskDialogButton").addEventListener('click', function(){
        deleteTask(task.id);
        addTask({title: input_title.value, description: textarea_description.value});
        closeEditDialog();
    })
}

function closeCreateDialog(){
    const dialog = document.querySelector("#create_dialog");
    dialog.parentNode.removeChild(dialog);
}

function closeEditDialog(){
    const dialog = document.querySelector("#edit_dialog");
    dialog.parentNode.removeChild(dialog);
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    drawTasks(); // Перерисовать список задач
}

function addTask(task){
    if(task.title === "") return;

    if(task.id != undefined){
        task.id = Date.now();
    }
    else{
        task = {id: Date.now() , ...task}
    }
    task.do = false;
    saveTask(task);
    drawTasks();
}

function toggleTask(idTask) {
    // Получаем массив задач из localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Ищем задачу с указанным id
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === idTask) {
            // Инвертируем значение поля 'do'
            tasks[i].do = !tasks[i].do;
            break;
        }
    }

    // Сохраняем обновлённый массив задач обратно в localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function saveTask(task){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Добавляем новую задачу в список
    tasks.push(task);
    
    // Обновляем список задач в localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteAllTaskElements() {
    const taskElements = document.querySelectorAll('[name="task"]');
    taskElements.forEach(element => {
        element.remove();
    });

    deleteNoneTask();
}

function clear(){
    deleteAllTaskElements();
    localStorage.setItem('tasks', null);
    drawTasks();
}

function drawTasks() {
    deleteAllTaskElements();

    // Получаем список задач из localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if(tasks.length > 0){
    tasks.forEach((task, index) => {
        addTaskHTML(task)
    });
}
else{
setNoneTask()
}
}

function addTaskHTML(task){
    const clone = document.importNode(task_template.content, true);
    const title = clone.querySelector('#title');
    const description = clone.querySelector('span');
    const deleteButton = clone.querySelector("[name='deleteTaskButton']");
    const editButton = clone.querySelector("[name='editTaskButton']");
    const copyButton = clone.querySelector("[name='copyTaskButton']");
    const checkBox = clone.querySelector("#is_do");

    checkBox.checked  = task.do;
    title.textContent = task.title;
    description.textContent = task.description;
    deleteButton.addEventListener('click', ()=>{ deleteTask(task.id)})
    editButton.addEventListener('click', ()=>{ openEditDialog(task)})
    copyButton.addEventListener('click', ()=>{ addTask(task)})
    checkBox.addEventListener('click', ()=>{toggleTask(task.id)})

    tasks_panel.appendChild(clone)
}

function deleteNoneTask(){
    var noneTasks = tasks_panel.querySelectorAll('[name="none_task"]');
    noneTasks.forEach(function(task) {
    task.parentNode.removeChild(task);
    });
}

function setNoneTask(){
    const clone = document.importNode(none_task_template.content, true);
    tasks_panel.appendChild(clone);
}