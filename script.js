
// ///function declaration
// // function greeting() {
// //     console.log('Good morning class')
// // }

// ///function expression

// const greet = function() {
//     console.log('Good afternoon, Allen')
// }


// function greeting(name) {
//     console.log(`Good morning everyone, my name is ${name}`)
// }

// // const calcAge = (name, yearOfBirth) => {
// //     console.log(`Good morning everyone, my name is ${name} and i am ${2025 - yearOfBirth} years old`)
// // }


// // calcAge('Allen', 1998)
// // calcAge('comfort', 2002)
// // calcAge('Akin', 2000)
// // calcAge('Godfrey', 2001)

// // const calcAge = function (birthYear) {
// //     return 2025 - birthYear
// // }


// // const yearsUntilRetirement = function(birthYear, firstName)   {
// //     const age = calcAge(birthYear)
// //     const retirement = 65 - age


// //     if(retirement > 0) {
// //         console.log(`${firstName} retires in ${retirement}`)
// //     } else {
// //         console.log(`${firstName} has already retired`)
// //     }
// // }


// // console.log(yearsUntilRetirement(1998, 'Allen'))

// /////Array
// const friend1 = 'James'
// const friend2 = 'Margret'
// const friend3 = 'comfort'

// console.log(friend1, friend2, friend3)


// // console.log(friends[2])


// ////Basic Array methods
// const friends = ['James', 'Margret', 'Comfort', 'Hammed']
//  friends.push('Daniel') ///Add to the end
// // const newFriends = friends.unshift('Daniel') /// Add to the beginning







// DOM ELEMENTS
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalTaskElement = document.getElementById('total-tasks');
const completedTask = document.getElementById('completed-tasks');
const pendingTask = document.getElementById('pending-tasks');
const filterButtons = document.querySelectorAll('.filter-btn');

// DATA
let tasks = [];
let taskIdCounter = 1;
let currentFilter = 'all';

// EVENT LISTENERS
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
taskInput.addEventListener('input', function () {
    addBtn.disabled = this.value.trim() === "";
});
filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderTask();
    });
});

// ADD TASK
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        editing: false
    };

    tasks.push(task);
    taskInput.value = '';
    addBtn.disabled = true;
    renderTask();
}

// TOGGLE TASK
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTask();
    }
}

// DELETE TASK
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTask();
    }
}

// START EDITING
function startEditing(taskId) {
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, editing: true } : { ...task, editing: false }
    );
    renderTask();
}

// CANCEL EDITING
function cancelEdit(taskId) {
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, editing: false } : task
    );
    renderTask();
}

// SAVE EDIT
function saveEdit(taskId) {
    const inputField = document.querySelector(`#edit-input-${taskId}`);
    const updatedText = inputField.value.trim();
    if (updatedText === '') {
        alert('Task cannot be empty');
        return;
    }
    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, text: updatedText, editing: false } : task
    );
    renderTask();
}

// RENDER TASK LIST
function renderTask() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const taskElement = createTask(task);
            taskList.appendChild(taskElement);
        });
    }

    updateTaskStats();
}

// CREATE TASK ITEM
function createTask(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    if (task.editing) {
        li.innerHTML = `
            <div class="task-content">
                <input id="edit-input-${task.id}" class="edit-input" type="text" value="${task.text}" />
                <button class="btn save-btn" onclick="saveEdit(${task.id})">Save</button>
                <button class="btn cancel-btn" onclick="cancelEdit(${task.id})">Cancel</button>
            </div>
        `;
    } else {
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? "checked" : ""} 
                    onclick="toggleTask(${task.id})"
                >
                <span class="task-text">${task.text}</span>
                <button class="btn edit-btn" onclick="startEditing(${task.id})">Edit</button>
                <button class="btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
    }

    return li;
}

// TASK STATS
function updateTaskStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTaskElement.textContent = total;
    completedTask.textContent = completed;
    pendingTask.textContent = pending;
}

// INIT
function init() {
    addBtn.disabled = true;
    renderTask();
}
init();






