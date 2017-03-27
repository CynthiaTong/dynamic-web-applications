$(document).ready(function() {

    $("#submit").click(function() {

      var email = $("#email").val();
      var recency = $("#period").val();
      var topic = $("#section").val();

      if (recency === null) $("#period").val("1");
      if (topic === null) $("#section").val("all-sections");

      if (email === undefined || topic === undefined || recency === undefined ||
          email.trim() === "") {
        $("#errorMsg").html("Please complete all the required fields before submit.");
      }
    });

    $("#unsubscribeBtn").click(function() {
      $("#form").attr("action", "/unsubscribe");
    });
});
