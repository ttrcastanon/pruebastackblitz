
$(document).ready(() => {
  $("#btnSave").click(() => {
    

    /*ruta para obtener el listado de áreas*/
    let url = "http://192.168.1.101/WebApiplantillaspartaneangular2/api/area/getall";

    http_call_get(url,successFn,errorFn);

    let description = $("#description").val();
    //console.log(description);
    return;
  });
  alert("Hello World");
})


const successFn = function (d) {
  //console.log(d);
};

const errorFn = function (err) {
  alert(err);
};