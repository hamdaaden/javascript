const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");
const studentCount = document.getElementById("studentCount");

let editIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  displayStudents();
});

/* -------------------------
   Utility Functions
-------------------------- */

function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;

  setTimeout(() => {
    message.textContent = "";
  }, 3000);
}

function capitalizeWords(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* -------------------------
   Validation
-------------------------- */

function validateStudent(name, age, course) {
  if (name.length < 3) {
    showMessage("Name must contain at least 3 characters", "red");
    return false;
  }

  if (!/^[a-zA-Z ]+$/.test(name)) {
    showMessage("Name should contain only letters", "red");
    return false;
  }

  if (age < 16 || age > 60) {
    showMessage("Age must be between 16 and 60", "red");
    return false;
  }

  if (course.length < 2) {
    showMessage("Course name is too short", "red");
    return false;
  }

  return true;
}

/* -------------------------
   Form Submit
-------------------------- */

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = capitalizeWords(document.getElementById("name").value);

  const age = Number(document.getElementById("age").value);

  let course = capitalizeWords(document.getElementById("course").value);

  if (!validateStudent(name, age, course)) return;

  let students = getStudents();

  const duplicate = students.find(
    (student, index) =>
      student.name.toLowerCase() === name.toLowerCase() && index !== editIndex,
  );

  if (duplicate) {
    showMessage("Student already exists", "red");
    return;
  }

  const student = {
    name,
    age,
    course,
    registeredOn: new Date().toLocaleString(),
  };

  if (editIndex === -1) {
    students.push(student);

    showMessage("Student Registered Successfully", "green");
  } else {
    students[editIndex] = student;

    showMessage("Student Updated Successfully", "green");

    editIndex = -1;
  }

  saveStudents(students);

  studentForm.reset();

  displayStudents();
});

/* -------------------------
   Display Students
-------------------------- */

function displayStudents(filteredStudents = null) {
  const students = filteredStudents || getStudents();

  studentTableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = `
        <tr>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>${student.registeredOn}</td>

            <td>
                <button onclick="editStudent(${index})">
                    Edit
                </button>

                <button onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    studentTableBody.innerHTML += row;
  });

  studentCount.textContent = `Total Students: ${students.length}`;
}

/* -------------------------
   Delete Student
-------------------------- */

function deleteStudent(index) {
  const confirmDelete = confirm("Are you sure you want to delete?");

  if (!confirmDelete) return;

  let students = getStudents();

  students.splice(index, 1);

  saveStudents(students);

  displayStudents();

  showMessage("Student Deleted", "orange");
}

/* -------------------------
   Edit Student
-------------------------- */

function editStudent(index) {
  const students = getStudents();

  const student = students[index];

  document.getElementById("name").value = student.name;

  document.getElementById("age").value = student.age;

  document.getElementById("course").value = student.course;

  editIndex = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* -------------------------
   Search
-------------------------- */

searchInput.addEventListener("keyup", () => {
  const keyword = searchInput.value.toLowerCase();

  const students = getStudents();

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(keyword) ||
      student.course.toLowerCase().includes(keyword),
  );

  displayStudents(filtered);
});

/* -------------------------
   Real-Time Validation
-------------------------- */

document.getElementById("name").addEventListener("input", function () {
  if (this.value.length < 3) {
    this.style.borderColor = "red";
  } else {
    this.style.borderColor = "green";
  }
});

document.getElementById("age").addEventListener("input", function () {
  if (this.value < 16 || this.value > 60) {
    this.style.borderColor = "red";
  } else {
    this.style.borderColor = "green";
  }
});

/* -------------------------
   Sorting
-------------------------- */

function sortStudents() {
  let students = getStudents();

  students.sort((a, b) => a.name.localeCompare(b.name));

  displayStudents(students);
}