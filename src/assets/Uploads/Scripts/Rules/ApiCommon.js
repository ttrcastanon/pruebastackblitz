

var baseURI = '';
const Api = "http://192.168.1.101/WebApiplantillaspartaneangular2/";
function getToken() {

    var urlToken = Api + "oauth/token"
    var url_base = urlToken;
    // The auth_token is the base64 encoded string for the API 
    // application.
    var auth_token = 'AppName@VendorName:BusinessUnit';
    auth_token = window.btoa(auth_token);
    var requestPayload = {
        // Enter your inContact credentials for the 'username' and 
        // 'password' fields.
        'grant_type': 'password',
        'username': 'admin',
        'password': 'admin',
        'scope': ''
    }

    $.ajax({
        'url': url_base,
        'async': false,
        'type': 'POST',
        'dataType': 'json',
        'headers': {
            // Use access_token previously retrieved from inContact token 
            // service.
            //'Authorization': 'basic '
            'content-Type': 'application/x-www-form-urlencoded'
        },
        'data': requestPayload,
        'success': function (result) {
            //Process success actions
            accessToken = result.access_token;
            // baseURI = result.resource_server_base_uri;
            //alert('Success!\r\nAccess Token:\r' + accessToken +          '\r\nBase URI:\r' + baseURI)
            // result.access_token;
            return accessToken;
        },
        'error': function (XMLHttpRequest, textStatus, errorThrown) {
            //Process error actions
            alert('Error: ' + errorThrown);
            //console.log(XMLHttpRequest.status + ' ' +
                XMLHttpRequest.statusText);
            return false;
        }
    });
    return accessToken;
}
function handleException(request, message,
    error) {
    var msg = "";
    msg += "Code: " + request.status + "\n";
    msg += "Text: " + request.statusText + "\n";
    if (request.responseJSON != null) {
        msg += "Message" +
            request.responseJSON.Message + "\n";
    }
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


function GetFile(Key) {
    ////console.log("key",Key);
    var ApiControllerUrl = "/api/Spartan_File";

    var accessToken = getToken();
    var spartanFile = {};
    // Call Web API to get a list of Product
    $.ajax({
        url: Api + ApiControllerUrl + "/Get?Id=" + Key,
        type: 'GET',
        dataType: 'json',
        'content-Type': 'application/json',
        dataType: 'json',
        async: false,
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            spartanFile = result;
            // //console.log(result,8);

        },
        error: function (request, message, error) {
            handleException(request, message, error);
            // //console.log(request,message,error);
        }
    });
    return spartanFile;

}


function GetFileComm(Key) {
    ////console.log("key",Key);
    var ApiControllerUrl = "api/Spartan_File";

    var accessToken = getToken();
    var spartanFile = {};
    // Call Web API to get a list of Product
    $.ajax({
        url: Api + ApiControllerUrl + "/Get?Id=" + Key,
        type: 'GET',
        dataType: 'json',
        'content-Type': 'application/json',
        dataType: 'json',
        async: false,
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            spartanFile = result;
            // //console.log(result,8);

        },
        error: function (request, message, error) {
            handleException(request, message, error);
            ////console.log(request,message,error);
        }
    });
    return spartanFile;

}

function PostFile(spartanFile) {
    ////console.log("key",Key);    
    var ApiControllerUrl = "api/Spartan_File/PostBase64";

    var accessToken = getToken(Api);
    var res = 0;
    // Call Web API to get a list of Product
    $.ajax({
        url: Api + ApiControllerUrl,
        type: 'POST',
        cache: false,
        dataType: "json",
        async: false,
        data: spartanFile,
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            res = result;
        },
        error: function (result) {
            //alert("Error ejecutando query");
        }
    });
    return res;

}


function ExecuteQuery(query) {
    ////console.log("key",Key);
    var ApiControllerUrl = "/api/Spartan_Query/Post";

    var accessToken = getToken(Api);
    var res = res;

    var data = {
        query: query
    }

    $.ajax({
        url: Api + ApiControllerUrl,
        type: 'POST',
        cache: false,
        dataType: "json",
        async: false,
        data: data,
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            res = result;
        },
        error: function (result) {
            alert("Error ejecutando query");
        }
    });
    return res;
}


function ExecuteQueryTable(query) {
    ////console.log("key",Key);
    var ApiControllerUrl = "api/Spartan_Query/GetRawQuery";

    var accessToken = getToken(Api);
    var res;

    var data = {
        query: query
    }

    $.ajax({
        url: Api + ApiControllerUrl,
        dataType: "json",
        cache: false,
        async: false,
        data: data,
        type: 'POST',
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            res = $.parseJSON(result);

        },
        error: function (result) {
            alert("Error ejecutando query", "error");
        }
    });
    return res;
}
function ExecuteQueryMultiplesTablas(query) {
    ////console.log("key",Key);
    var ApiControllerUrl = "api/Spartan_Query/ExecuteQueryMultiplesTablas";

    var accessToken = getToken(Api);
    var res;

    var data = {
        query: query
    }

    $.ajax({
        url: Api + ApiControllerUrl,
        dataType: "json",
        cache: false,
        async: false,
        data: data,
        type: 'POST',
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {


            res = result;// $.parseJSON(result);

        },
        error: function (result) {
            alert("Error ejecutando query", "error");
        }
    });
    return res;
}


function ExecuteQueryDictionary(query) {
    ////console.log("key",Key);
    var ApiControllerUrl = "api/Spartan_Query/GetDictionary";

    var accessToken = getToken(url_content);
    var res;

    var data = {
        query: query
    }

    $.ajax({
        url: Api + ApiControllerUrl,
        dataType: "json",
        cache: false,
        async: false,
        data: data,
        type: 'POST',
        headers: {
            // Use access_token previously retrieved from inContact token 
            // service.
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (result) {
            res = result;

        },
        error: function (result) {
            alert("Error ejecutando query", "error");
        }
    });
    return res;
}