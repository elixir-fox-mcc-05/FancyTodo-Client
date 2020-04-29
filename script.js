let baseUrl = "http://localhost:3000";

$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    // console.log($("#email").val());
    // console.log($("#password").val());

    $.ajax({
      method: "post",
      url: baseUrl + "/users/signin",
      data: {
        email: $("#email").val(),
        password: $("#password").val(),
      }
    })
      .done((result) => {
        console.log("data =====>", result);
      })
      .fail((err) => {
        console.log("error =====>", err);
      })
    // .always();
  });
});
