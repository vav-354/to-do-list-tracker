
const input = document.querySelector('#todo-input');
const weeklyInput = document.getElementById('weekly-task-input');
const weeklyButton = document.getElementById('add-weekly-task');
const weeklyGoalsContainer = document.getElementById('weekly-goals-container');
const monthlyInput = document.getElementById('monthly-task-input');
const monthlyButton = document.getElementById('add-monthly-task');
const monthlyGoalsContainer = document.getElementById('monthly-goals-container');

const addTodoItem = () => {
  const inputData = input.value.trim();
  if (inputData === "") return;  
  input.value = "";

  const todo_el = document.createElement('div');
  todo_el.classList.add('todo-item');

  const todo_input_el = document.createElement('input');
  todo_input_el.type = 'text';
  todo_input_el.value = inputData;
  todo_input_el.setAttribute('readonly', 'readonly');

  const todo_done_el = document.createElement('i');
  todo_done_el.classList.add('fa-solid', 'fa-check');

  const todo_edit_el = document.createElement('i');
  todo_edit_el.classList.add('fa-solid', 'fa-pen-to-square', 'edit');

  const todo_delete_el = document.createElement('i');
  todo_delete_el.classList.add('fa-solid', 'fa-trash');

  const todo_actions_el = document.createElement('div');
  todo_actions_el.classList.add('action-items');
  todo_actions_el.appendChild(todo_done_el);
  todo_actions_el.appendChild(todo_edit_el);
  todo_actions_el.appendChild(todo_delete_el);

  todo_el.appendChild(todo_input_el);
  todo_el.appendChild(todo_actions_el);

  document.querySelector('.todo-lists').appendChild(todo_el);

  
  todo_done_el.addEventListener('click', () => {
    todo_input_el.classList.toggle('done');
  });

  
  todo_edit_el.addEventListener('click', () => {
    if (todo_edit_el.classList.contains("edit")) {
      todo_edit_el.classList.remove("edit");
      todo_edit_el.classList.remove("fa-pen-to-square");
      todo_edit_el.classList.add("fa-x");
      todo_edit_el.classList.add("save");
      todo_input_el.removeAttribute("readonly");
      todo_input_el.focus();
    } else {
      todo_edit_el.classList.remove("save");
      todo_edit_el.classList.remove("fa-x");
      todo_edit_el.classList.add("fa-pen-to-square");
      todo_edit_el.classList.add("edit");
      todo_input_el.setAttribute("readonly", "readonly");
    }
  });

  todo_delete_el.addEventListener('click', () => {
    document.querySelector('.todo-lists').removeChild(todo_el);
  });
};

document.querySelector('#submit').addEventListener('click', addTodoItem);

input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodoItem();
  }
});

function createProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('progress-tracker');

  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');

  const progressFill = document.createElement('div');
  progressFill.classList.add('progress-fill');

  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);

  const progressStatus = document.createElement('p');
  progressStatus.classList.add('progress-status');
  progressStatus.textContent = '0% Complete';
  progressContainer.appendChild(progressStatus);

  return { progressContainer, progressFill, progressStatus };
}


function addWeeklyGoal() {
  const goal = weeklyInput.value.trim();
  if (goal === "") return;

  const { progressContainer, progressFill, progressStatus } = createProgressBar();
  const goalContainer = document.createElement('div');
  goalContainer.classList.add('goal-item');
  goalContainer.textContent = `Weekly Goal: ${goal}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    weeklyGoalsContainer.removeChild(goalWrapper);
    saveData(); 
  });

  const goalWrapper = document.createElement('div');
  goalWrapper.appendChild(goalContainer);
  goalWrapper.appendChild(progressContainer);
  goalWrapper.appendChild(deleteButton);

  weeklyGoalsContainer.appendChild(goalWrapper);
  weeklyInput.value = "";
  saveData(); 
  updateProgressBars(); 
  const startDate = new Date().toISOString();
  const weeklyGoals = JSON.parse(localStorage.getItem('weeklyGoals')) || [];
  weeklyGoals.push({ goal, startDate });
  localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
}

function addMonthlyGoal() {
  const goal = monthlyInput.value.trim();
  if (goal === "") return;

  const { progressContainer, progressFill, progressStatus } = createProgressBar();
  const goalContainer = document.createElement('div');
  goalContainer.classList.add('goal-item');
  goalContainer.textContent = `Monthly Goal: ${goal}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    monthlyGoalsContainer.removeChild(goalWrapper);
    saveData(); 
  });

  const goalWrapper = document.createElement('div');
  goalWrapper.appendChild(goalContainer);
  goalWrapper.appendChild(progressContainer);
  goalWrapper.appendChild(deleteButton);

  monthlyGoalsContainer.appendChild(goalWrapper);
  monthlyInput.value = "";
  saveData(); 
  updateProgressBars(); 
  const startDate = new Date().toISOString();
  const monthlyGoals = JSON.parse(localStorage.getItem('monthlyGoals')) || [];
  monthlyGoals.push({ goal, startDate });
  localStorage.setItem('monthlyGoals', JSON.stringify(monthlyGoals));
}

function updateProgressBars() {
  const now = new Date();

  const weeklyGoals = JSON.parse(localStorage.getItem('weeklyGoals')) || [];
  weeklyGoalsContainer.querySelectorAll('.goal-item').forEach((goalContainer, index) => {
    const startDate = new Date(weeklyGoals[index].startDate);
    const progressFill = goalContainer.nextElementSibling.querySelector('.progress-fill');
    const progressStatus = goalContainer.nextElementSibling.querySelector('.progress-status');
    
    const endOfWeek = new Date(startDate);
    endOfWeek.setDate(startDate.getDate() + 7);

    const weekProgress = Math.min((now - startDate) / (endOfWeek - startDate), 1) * 100;
    progressFill.style.width = `${weekProgress}%`;
    progressStatus.textContent = `${Math.round(weekProgress)}% Complete`;
  });

  
  const monthlyGoals = JSON.parse(localStorage.getItem('monthlyGoals')) || [];
  monthlyGoalsContainer.querySelectorAll('.goal-item').forEach((goalContainer, index) => {
    const startDate = new Date(monthlyGoals[index].startDate);
    const progressFill = goalContainer.nextElementSibling.querySelector('.progress-fill');
    const progressStatus = goalContainer.nextElementSibling.querySelector('.progress-status');
    
    const endOfMonth = new Date(startDate);
    endOfMonth.setMonth(startDate.getMonth() + 1);

    const monthProgress = Math.min((now - startDate) / (endOfMonth - startDate), 1) * 100;
    progressFill.style.width = `${monthProgress}%`;
    progressStatus.textContent = `${Math.round(monthProgress)}% Complete`;
  });
}

function saveData() {
  const weeklyGoals = [];
  weeklyGoalsContainer.querySelectorAll('.goal-item').forEach(goalContainer => {
    const goal = goalContainer.textContent.replace('Weekly Goal: ', '');
    const startDate = new Date().toISOString();
    weeklyGoals.push({ goal, startDate });
  });
  localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));

  const monthlyGoals = [];
  monthlyGoalsContainer.querySelectorAll('.goal-item').forEach(goalContainer => {
    const goal = goalContainer.textContent.replace('Monthly Goal: ', '');
    const startDate = new Date().toISOString();
    monthlyGoals.push({ goal, startDate });
  });
  localStorage.setItem('monthlyGoals', JSON.stringify(monthlyGoals));
}


function loadData() {
  const savedWeeklyGoals = JSON.parse(localStorage.getItem('weeklyGoals')) || [];
  const savedMonthlyGoals = JSON.parse(localStorage.getItem('monthlyGoals')) || [];

  savedWeeklyGoals.forEach(({ goal, startDate }) => {
    weeklyInput.value = goal;
    addWeeklyGoal();
    weeklyInput.value = ""; 
  });

  savedMonthlyGoals.forEach(({ goal, startDate }) => {
    monthlyInput.value = goal;
    addMonthlyGoal();
    monthlyInput.value = ""; 
  });

  updateProgressBars(); 
}


weeklyButton.addEventListener('click', addWeeklyGoal);
weeklyInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addWeeklyGoal();
  }
});

monthlyButton.addEventListener('click', addMonthlyGoal);
monthlyInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addMonthlyGoal();
  }
});


window.addEventListener('load', loadData);

function cleanUpUndefinedGoals(containerId) {
    let container = document.getElementById(containerId);
    let items = container.getElementsByClassName('goal-item');

    Array.from(items).forEach(item => {
        if (item.querySelector('span').textContent.trim() === "undefined") {
            container.removeChild(item);
        }
    });
}


function addGoal(type, goalText) {
    let goalContainer = type === "weekly" ? document.getElementById("weekly-goals-container") : document.getElementById("monthly-goals-container");

    
    if (goalText && goalText !== "undefined") {
        let goalItem = document.createElement("div");
        goalItem.className = "goal-item";

        goalItem.innerHTML = `
            <span>${goalText}</span>
            <button class="delete-goal-btn">Delete</button>
        `;

        goalContainer.appendChild(goalItem);

        goalItem.querySelector(".delete-goal-btn").addEventListener("click", function() {
            goalContainer.removeChild(goalItem);
        });
    }
}


document.getElementById("add-weekly-goal-btn").addEventListener("click", function() {
    let weeklyGoalInput = document.getElementById("weekly-goal-input").value.trim();
    if (weeklyGoalInput) {
        addGoal("weekly", weeklyGoalInput);
        document.getElementById("weekly-goal-input").value = ""; 
    } else {
        alert("Please enter a valid weekly goal.");
    }
});

document.getElementById("add-monthly-goal-btn").addEventListener("click", function() {
    let monthlyGoalInput = document.getElementById("monthly-goal-input").value.trim();
    if (monthlyGoalInput) {
        addGoal("monthly", monthlyGoalInput);
        document.getElementById("monthly-goal-input").value = "";
    } else {
        alert("Please enter a valid monthly goal.");
    }
});


window.onload = function() {
    cleanUpUndefinedGoals("weekly-goals-container");
    cleanUpUndefinedGoals("monthly-goals-container");
};

