let baseUrl = "http://localhost:3000";
let idTemporary = "";

$(document).ready(function () {
  auth();

  $("#signUpForm").submit(function (event) {
    event.preventDefault();

    $.ajax({
      method: "post",
      url: baseUrl + "/users/signup",
      data: {
        name: $("#nameSignUp").val(),
        email: $("#emailSignUp").val(),
        password: $("#passwordSignUp").val(),
      },
    })
      .done((data) => {
        auth();
      })
      .fail((err) => {
        console.log(err.responseJSON.err.msg);
      })
      .always((_) => {
        $("#nameSignUp").val(""),
          $("#emailSignUp").val(""),
          $("#passwordSignUp").val("");
      });
  });

  $("#signInForm").submit(function (event) {
    event.preventDefault();

    $.ajax({
      method: "post",
      url: baseUrl + "/users/signin",
      data: {
        email: $("#emailSignIn").val(),
        password: $("#passwordSignIn").val(),
      },
    })
      .done((data) => {
        localStorage.setItem("token", data.token);
        auth();
      })
      .fail((err) => {
        console.log(err);
      })
      .always((_) => {
        $("#emailSignIn").val(""), $("#passwordSignIn").val("");
      });
  });
});

function auth() {
  if (localStorage.getItem("token")) {
    $("#signinPage").hide();
    $("#mainPage").show();
    $("#formAddTodo").hide();
    $("#formEditTodo").hide();

    fetchTodo();
  } else {
    $("#signinPage").show();
    $("#mainPage").hide();
    $("#formAddTodo").hide();
    $("#formEditTodo").hide();
  }
}

function signout() {
  // const auth2 = gapi.auth2.getAuthInstance();
  // auth2.signOut().then(function () {
    localStorage.clear();
    $("#signinPage").show();
    $("#mainPage").hide();
    $("#formAddTodo").hide();
    $("#formEditTodo").hide();
    auth();
  // });

}

// read
function fetchTodo() {
  $.ajax({
    method: "get",
    url: baseUrl + "/todos",
    headers: {
      token: localStorage.token,
    },
  })
    .done((data) => {
      $(".cardContainer").empty();
      data.todos.forEach((todo) => {
        $(".cardContainer").append(`
        <div class="card" style="width: 18rem;">
          <div class="card-header">${todo.id}. ${todo.title}</div>
          <div class="card-body">
            <p class="card-title">Status: ${todo.status}</p>
            <p class="card-text">
              ${todo.description}
            </p>
            <p class="card-text">
              ${todo.due_date}
            </p>
            <button onclick="showEditForm(${todo.id})" class="btnCard btn btn-primary">Edit Todo</button>
            <button onclick="deleteTodo(${todo.id})" class="btnDelete btn btn-danger">Delete Todo</button>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      console.log(err.responseJSON.err.msg, "erooooooooooooooooorrrr");
    });
}

// create
function showAddForm() {
  $("#mainPage").hide();
  $("#formAddTodo").show();
  $("#formEditTodo").hide();
}

function addNewTodo(event) {
  event.preventDefault();
  let newTodo = {
    title: $("#titleAddTodo").val(),
    description: $("#descriptionAddTodo").val(),
    due_date: $("#dueDateAddTodo").val(),
  };
  $.ajax({
    method: "post",
    url: baseUrl + "/todos",
    headers: {
      token: localStorage.token,
    },
    data: newTodo,
  })
    .done((_) => {
      fetchTodo();
      $("#mainPage").show();
      $("#formAddTodo").hide();
      $("#formEditTodo").hide();
    })
    .fail((err) => {
      console.log(err.responseJSON.err.msg);
    })
    .always((_) => {
      $("#titleAddTodo").val(""),
        $("#descriptionAddTodo").val(""),
        $("#dueDateAddTodo").val("");
    });
}

function cancel() {
  $("#mainPage").show();
  $("#formAddTodo").hide();
  $("#formEditTodo").hide();
}

// delete
function deleteTodo(id) {
  $.ajax({
    method: "delete",
    url: baseUrl + `/todos/${id}`,
    headers: {
      token: localStorage.token,
    },
  })
    .done((data) => {
      auth();
    })
    .fail((err) => {
      console.log(err.responseJSON.err.msg);
    });
}

// update
function showEditForm(id, title, description, due_date) {
  idTemporary = id;
  $("#formEditTodo").empty();
  $("#mainPage").hide();
  $.ajax({
    method: "get",
    url: baseUrl + `/todos/${id}`,
    headers: {
      token: localStorage.token,
    },
  }).done((data) => {
    $("#formEditTodo").append(`
     <h2 class="form-title">Edit Todo Form</h2>
      <form onsubmit="editTodo(event)" class="editTodoForm addTodoForm">
        <label class="labelEditTodo labelSignIn">
          <input
            type="text"
            id="titleEditTodo"
            class="addTodoInput userSignInInput signInInput"
            placeholder="Todo Title"
            value="${data.todo.title}"
          />
        </label>
        <label class="labelEditTodo labelSignIn">
          <input
            type="text"
            id="descriptionEditTodo"
            class="addTodoInput userSignInInput signInInput"
            placeholder="Todo Description"
            value="${data.todo.description}"
          />
        </label>
        <label class="labelEditTodo labelSignIn">
          <input
            type="text"
            id="statusEditTodo"
            class="addTodoInput userSignInInput signInInput"
            placeholder="Todo status"
            value="${data.todo.status}"
          />
        </label>
        <label class="labelEditTodo labelSignIn">
          <input
            type="date"
            id="dueDateEditTodo"
            class="addTodoInput userSignInInput signInInput"
            placeholder="Todo Due Date"
            value="${data.todo.due_date}"
          />
        </label>
        <input type="submit" value="Edit Todo" class="submitAddTodoForm" />
        <input
          onclick="cancel()"
          type="button"
          value="Cancel"
          class="cancelButton"
        />
      </form>
  `);
  });

  $("#formEditTodo").show();
}

function editTodo(event) {
  event.preventDefault();

  let updateTodo = {
    title: $("#titleEditTodo").val(),
    description: $("#descriptionEditTodo").val(),
    status: $("#statusEditTodo").val(),
    due_date: $("#dueDateEditTodo").val(),
  };
  $.ajax({
    method: "put",
    url: baseUrl + `/todos/${idTemporary}`,
    headers: {
      token: localStorage.token,
    },
    data: updateTodo,
  })
    .done((_) => {
      auth();
      fetchTodo();
    })
    .fail((err) => {
      console.log(err);
    });
}

// function onSignIn(googleUser) {
//   const id_token = googleUser.getAuthResponse().id_token;

//   $.ajax({
//     url: `${baseUrl}/users/google-login`,
//     method: 'post',
//     headers:{
//       google_token = id_token
//     }
//   })
//   .done(data=>{
//     localStorage.setItem("token", data.token);
//     $("#mainPage").show();
//       $("#formAddTodo").hide();
//       $("#formEditTodo").hide();
//     auth()
    
//   })
//   .fail(err=>{
//     console.log(err);
    
//   })
// }