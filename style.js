let open = true

function openNav() {
    if (open == true) {
        $('#sidebar').hide()
        open = false;
        console.log(open)
    } else if (open==false) {
        $('#sidebar').show()
        open = true;
    }
  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }