let TasksContainer = document.querySelector(".tasks");
let input = document.querySelector(".input input");
let addTaskButton = input.nextElementSibling;
let isEditingMode = false;
let EditingTask;
let TasksArray;

// initial TasksArray
TasksArray = JSON.parse(localStorage.getItem("tasks"))
  ? JSON.parse(localStorage.getItem("tasks"))
  : [
      { title: "Go Joging", id: 1722597380720 },
      { title: "Learning Js", id: 1722597416663 },
    ];

const renderTasks = () => {
  if (TasksArray.length < 1) return;

  const fragment = document.createDocumentFragment();
  TasksArray.forEach((task) => fragment.prepend(CreateTaskElement(task)));
  TasksContainer.appendChild(fragment);
};

const SaveToLS = () =>
  localStorage.setItem("tasks", JSON.stringify(TasksArray));

const HandleTaskAction = ({ target }) => {
  const taskEl = target.closest(".task");
  if (!taskEl) return;
  const TaskId = taskEl.dataset.id;
  if (target.closest(".delete-task")) DeleteTask(TaskId);
  else if (target.closest(".edit-task")) SetEditMode(TaskId);
};

const CreateTaskElement = ({ id, title }) => {
  const task = document.createElement("div");
  task.classList.add("task");
  task.dataset.id = id;
  task.innerHTML = `
    <p class="title">${title}</p>
    <div class="settings">
      <button class="delete-task btn"><i class="bx bx-trash"></i></button>
      <button class="edit-task btn"><i class="bx bx-edit"></i></button>
    </div>
  `;
  return task;
};

const handleAddEditTask = () => {
  const title = input.value.trim();
  if (!title) return;
  if (isEditingMode) {
    if (title == EditingTask.title) return;
    const index = TasksArray.findIndex((el) => el.id == EditingTask.id);
    TasksArray[index].title = title;
    SaveToLS();
    EditingTask.titleElement.textContent = title;
    ResetEditingMode();
  } else {
    const task = { title, id: Date.now() };
    TasksArray.push(task);
    TasksContainer.prepend(CreateTaskElement(task));
  }

  SaveToLS();
  input.value = "";
  input.focus();
};

const DeleteTask = (taskid) => {
  TasksArray = TasksArray.filter((obj) => obj.id != taskid);

  SaveToLS();
  if (isEditingMode && taskid == EditingTask.id) ResetEditingMode();
  // remove from the page
  const task = TasksContainer.querySelector(`[data-id="${taskid}"]`);
  task.remove();
};

const ResetEditingMode = () => {
  isEditingMode = false;
  EditingTask = null;
  addTaskButton.textContent = "add task";
  input.value = "";
};
const SetEditMode = (taskid) => {
  const titleElement = TasksContainer.querySelector(
    `[data-id="${taskid}"] .title`
  );
  const title = titleElement.textContent;
  input.value = title;
  addTaskButton.textContent = "Edit Task";
  isEditingMode = true;
  EditingTask = {
    title: title,
    id: taskid,
    titleElement,
  };
};
renderTasks();
addTaskButton.addEventListener("click", handleAddEditTask);
TasksContainer.addEventListener("click", HandleTaskAction);
