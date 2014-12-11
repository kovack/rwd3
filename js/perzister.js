$(document).ready(function () {
    // ================================================================================== history ...
    // kk 26.09.2014. created
    // ================================================================================== general ... 

    var strAppName = '';
    strAppName = $('body').attr('data-perzister-appname');
    data = document.location.pathname.match(/[^\/]+$/);
    if (data != null && data !== undefined) {
        strAppName = document.location.pathname.match(/[^\/]+$/)[0];
    } else { strAppName = 'index.html';}
    
    if (strAppName != 'login.htm' && strAppName != 'index.html') { localStorage.perzisterApp = strAppName; }


    if (localStorage.perzisterURL != undefined) { $("#w").val(localStorage.perzisterURL) };
    if (localStorage.perzisterGUID != undefined) { $("#g").html(localStorage.GUID) };
    if (localStorage.perzisterE != undefined) { $("#e").val(localStorage.perzisterE) };
    if (localStorage.perzisterP != undefined) { $("#p").val(localStorage.perzisterP) };
    if (localStorage.perzisterD != undefined) { $("#d").val(localStorage.perzisterD) };
    if (localStorage.perzisterO != undefined) { $("#o").val(localStorage.perzisterO) };
    if (localStorage.perzisterLANGID != undefined) { $("#langid").attr("data-langid", localStorage.perzisterLANGID) };
    if (localStorage.perzisterLANGCAPTION != undefined) { $("#langid").html(localStorage.perzisterLANGCAPTION) };

    $('form :input').on('change input', function (e) { $('.perzister-erroralert').addClass('hide'); });
    $("input[type=text]").focus(function () { $(this).select(); });
    $("input[type=text]").mouseup(function (e) { e.preventDefault(); });

    $('a[href="#"]').click(function (e) { e.preventDefault(); });
          
    $('form').submit(function (e) { e.preventDefault(); return false; });

    $(".printdoc").on('click', function () { window.print(); return false; });
   
    FillActionButton(); // it's acutally NAV items filler

    FillCombos(); // generic routine for populating select controls within "combobox" classes

    $('body').keydown(function (e) {
        //if (e.keyCode == 27) { $("#search").focus(); e.preventDefault; }
    });

    $(document).on('click', '.navbar-collapse.in', function (e) { // close dropdown after item click
        if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
            $(this).collapse('hide');
        }
    });

    // ====================================================================================== populate APPS : ALL, HISTORY & FAVORITES

    $('#appsmodaltabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // store the currently selected tab in the hash value
    $("#appsmodaltabs a").on("shown.bs.tab", function (e) {
        var id = $(e.target).attr("href").substr(1);
        //window.location.hash = id;
        localStorage.perzisterAPPMODALTAB = id
    });


    //$('#apptitle').click(function (e) { $(".sectionng").addClass('hide'); $("#" + $(this).attr('data-perzister-showsectiononclick')).toggleClass('hide'); $(window).resize(); });

    $("#apptitle,.quickapplicationlistbtn").on('click', function () {
       
        if ($("#quickapplicationlist").html() == '') {
            if (localStorage.perzisterApps != undefined) {
                var str = '';
                var obj2 = JSON.parse(localStorage.perzisterApps);
                $.each(obj2.apps, function (i, item) {
                    if (item.Parametar != '') {
                        str = str
                                + '<tr class="approw" data-url="' + item.Parametar + '" data-ikona="' + item.Ikona + '" data-opis="' + item.Opis + '" data-hint="' + item.Hint + '" >'
                                + '<td>'
                                + '<div class="pull-left perzister-dimed "><i class="fa fa-' + item.Ikona + ' fa-3x fa-fw approwicon"></i></div>'
                                + '</td>'
                                + '<td>'
                                + '<strong>' + item.Opis + '</strong> <div class="text-muted">' + item.Hint + '</div>'
                                + '<td>'
                                + '</tr>'
                    }
                }
                );
                $("#quickapplicationlist").html('<table class="table table-hover"><tbody>' + str + '</tbody></table>');
            }
        }

        if ($("#quickapplicationlisthistory").html() == '') {
            if (localStorage.perzisterAppHistory != undefined) {
                str = '';
                var obj3 = JSON.parse(localStorage.perzisterAppHistory);
                var i = obj3.apps.length;
                while (i--) {
                    item = obj3.apps[i];
                    if (item.Parametar != '') {
                        str = str
                                    + '<tr class="approw" data-url="' + item.Parametar + '" data-ikona="' + item.Ikona + '" data-opis="' + item.Opis + '" data-hint="' + item.Hint + '" >'
                                    + '<td>'
                                    + '<div class="pull-left perzister-dimed "><i class="fa fa-' + item.Ikona + ' fa-3x fa-fw approwicon"></i></div>'
                                    + '</td>'
                                    + '<td>'
                                    + '<strong>' + item.Opis + '</strong> <div class="text-muted">' + item.Hint + '</div>'
                                    + '<td>'
                                    + '</tr>'
                    }
                }

                $("#quickapplicationlisthistory").html('<table class="table table-hover"><tbody>' + str + '</tbody></table>');
            }
        }

        $(".approw").on('click', function () { // first save click for history list then redirect to url
            var jsonStrApps = localStorage.perzisterAppHistory;
            if (jsonStrApps == undefined) {
                var jsonStrApps = '{"apps":[{"Parametar":"","Ikona":"","Opis":"","Hint":""}]}';
            }
            var objApps = JSON.parse(jsonStrApps);
            while (objApps['apps'].length > 10) {
                objApps['apps'].shift();
            }
            objApps['apps'].push({ "Parametar": "" + $(this).attr('data-url') + "", "Ikona": "" + $(this).attr('data-ikona') + "", "Opis": "" + $(this).attr('data-opis') + "", "Hint": "" + $(this).attr('data-hint') + "" });
            jsonStrApps = JSON.stringify(objApps);
            localStorage.perzisterAppHistory = jsonStrApps
            window.location = '' + $(this).attr('data-url');
        });

        $("#quickapplicationlistdialog").modal("show");
        var hash = localStorage.perzisterAPPMODALTAB;
        $('#appsmodaltabs a[href="#' + hash + '"]').tab('show');

    });

    // ====================================================================================== populate NAV ACTION button  

    

    function FillActionButton() {
        ConsoleLog('START FillActionButton()');
        $(".sectionng").each(function (index) {
            if ($(this).attr('data-perzister-sectiontitle') == 'divider') {
                $("#actionbutton").append('<li class="divider"></li>');
            }
            else if ($(this).attr('data-perzister-sectiontitle') == 'exit') {
                $("#actionbutton").append('<li><a href="' + $(this).attr('data-url') + '"><i class="fa fa-times fa-lg "></i> <span class="hidden-sm">exit</span></a></li>');
            }
            else if ($(this).attr('data-perzister-sectiontitle') == 'logout') {
                $("#actionbutton").append('<li><a href="' + $(this).attr('data-url') + '"><i class="fa fa-sign-out fa-lg "></i> <span class="hidden-sm">logout</span></a></li>');
            }
            
            else {
                var str = '';
                var i = 0;
                if (($(this).attr('data-perzister-sectionicon') != undefined) && ($(this).attr('data-perzister-sectionicon') != '')) {
                    str = '<i class="fa fa-' + $(this).attr('data-perzister-sectionicon') + ' fa-lg "></i>';
                    i = i + 1;
                }
                if (($(this).attr('data-perzister-sectiontitle') != undefined) && ($(this).attr('data-perzister-sectiontitle') != '')) {
                    if (i == 1) {
                        str = str + ' <span class="hidden-sm">' + $(this).attr('data-perzister-sectiontitle') + '</span>';
                    } else {
                        str = str + ' ' + $(this).attr('data-perzister-sectiontitle');
                    }


                }
                if (str != '') { $("#actionbutton").append('<li class="actionbutton"  data-perzister-showsectiononclick="' + $(this).attr('id') + '" ><a href="#">' + str + '</a></li>'); }
            }
        });

        $(".actionbutton").on("click", function (e) {
            $(".sectionng").addClass('hide');
            $("#" + $(this).attr('data-perzister-showsectiononclick')).toggleClass('hide').find('form:first').find('input:first').focus();
            $(window).resize();
        });
    }

    // ============================================================================= perzist (persist)

    var oldvalue = '';

    
    $(".perzistonlostfocus").on("focus", function () {
        //alert($(this));
        //oldvalue = $(this).val();
    });

    $(".perzistonlostfocus").on("blur", function () {
        //alert(this.value);
        if ($(this).val() != oldvalue) { PerzistItem($(this)); }
    });
        
    $(".perzistonkeyup").on("keyup", function () {
         //alert(this.value);
         PerzistItem($(this));  
    });

    function PerzistItem(obj) {
        ConsoleLog('START PerzistItem()');
        var Key = obj.attr("id");
        var DataKey = obj.attr("data-key");
        if (typeof DataKey != 'undefined') { var Key = DataKey; }
        var Value = encodeURIComponent(obj.val());
        if (obj.prop('type') == 'checkbox') { Value = obj.prop('checked'); };
        $.ajax({
            url: localStorage.perzisterURL,
            data: "d=" + localStorage.perzisterD + "&action=perzistitem&app=" + strAppName + "&key=" + Key + "&value=" + Value,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 20000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                   //
                }
                );
            }
        });
    }

    // ====================================================================================== search box , jupiter look & feel
    $(".searchtextbox").on("focus", function () { oldvalue = $(this).val(); });

    $('.searchtextbox').on("keydown", function (e) {
        $('#searchbox').attr('data-caller', $(this).attr('id'));
        if (e.keyCode == 13) {
            if (($(this).val() != '') && ($(this).val() != oldvalue)) {
                SearchBox($(this).val(), $(this).attr('data-perzister-webserviceaction'));
                return false;
            }
        }
        if (e.keyCode == 27) {
            $('#searchbox').modal('hide');
            $("#" + $('#searchbox').attr('data-caller')).focus();
            return false;
        }
    });

    function SearchBox(s, action) {
        ConsoleLog('START SearchBox()');
        $("#itemserverresponse").html('');
        $("#searchlist").html('');
        $("#ajaxloader1").show();
        $('#searchboxtitle').html(s);
        $('#searchbox').modal('show');
        var formattedHTML = '';
        $.ajax({
            url: localStorage.perzisterURL,
            data: "d=" + localStorage.perzisterD + "&action=" + action + "&s=" + s,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 20000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    formattedHTML = formattedHTML + '<li data-id="' + item.id + '" data-title="' + item.title + '" class="list-group-item searchboxitem"><span class="badge">' + item.badge + '</span><strong>' + item.title + '</strong><div class="text-muted">' + item.subtitle + '</div></li>'
                }
                );
                $("#ajaxloader1").hide();
                $("#searchlist").html('<ul class="list-group">' + formattedHTML + '</ul>');
                $(".searchboxitem").on('click', function () {
                    $('#searchbox').modal('hide');
                    $("#" + $('#searchbox').attr('data-caller')).val($(this).attr('data-title'));
                    $("#" + $('#searchbox').attr('data-caller')).attr('data-id', $(this).attr('data-id'));
                    $("#" + $('#searchbox').attr('data-caller')).focus();
                    PerzistItem($("#" + $('#searchbox').attr('data-caller')));
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#itemserverresponse").html("<br/><div class='alert'><h6>" + thrownError + ' ' + xhr.status + '</h4></div>');
            }
        });
    }
    
    // ====================================================================================== get 1 item and fill form

    function GetItem(id) {
        ConsoleLog('START GetItem()');
        $("#itemserverresponse").html('');
        $("#ajaxloader0,#appheadericon").toggleClass('hide');
        $("#ajaxloader4").show();
        $.ajax({
            url: localStorage.perzisterURL,
            data: "d=" + localStorage.perzisterD + "&action=getitem&itemid=" + id,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 20000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    $.each(item, function (i2, item2) {
                        $("#" + i2).val(item2);         // fill all form fields
                    });
                    $("#ItemId").attr('value',item.Id); // manual entry
                }
                );
                $("#ajaxloader4").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader4").hide();
                $("#itemserverresponse").html("<br/><div class='alert'><h6>" + thrownError + ' ' + xhr.status + '</h4></div>');
                $("#ajaxloader0,#appheadericon").toggleClass('hide');
            }
        });
    }

    // ====================================================================================== POPULATE COMBO(S)

    function FillCombos() {
        ConsoleLog('START FillCombos()');
        $(".combobox").each(function (index) {
            FillCombo($(this).attr('id'), $(this).attr('data-perzister-webserviceaction'));
        });
    }

    function FillCombo(controlid, webserviceaction) {
        $("#ajaxloader0,#appheadericon").toggleClass('hide');
        var jsonStr = localStorage.getItem('perzisterCOMBO' + webserviceaction);
        if (jsonStr == undefined) {
            $.ajax({
                url: localStorage.perzisterURL,
                data: "d=" + localStorage.perzisterD + "&action=" + webserviceaction + "&controlid=" + controlid,
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                timeout: 20000,
                success: function (data, status) {
                    $.each(data, function (i, item) {
                        // first recorset
                        if (i == 0) {
                            $.each(item, function (i, item) {
                                controlid = item.controlid
                            });
                        }
                        // second recorset
                        if (i == 1) {
                            $.each(item, function (i, item) {
                                $("#" + controlid).append('<option value="' + item.id + '">' + item.title + '</option>');
                            });
                        }
                        localStorage.setItem('perzisterCOMBO' + webserviceaction,$("#" + controlid).html());
                    });
                    $("#ajaxloader0,#appheadericon").toggleClass('hide');
                }
            });
        } else {
            $("#" + controlid).append(jsonStr);
        }
    }
    
    // ============================================================================= ENTER AS TAB

    $('.enterastab').on("keypress", function (e) {
        if (e.keyCode == 13) {
            var inputs = $(this).parents("form").eq(0).find(":input");
            var idx = inputs.index(this);

            if (idx == inputs.length - 1) {
                inputs[0].select()
            } else {
                inputs[idx + 1].focus();
                inputs[idx + 1].select();
            }
            return false;
        }
    });
    
    // ================================================================= language

    Translate();

    $(".langselector").on('click', function () {
        $("#langid").html($(this).html());
        localStorage.perzisterLANGID = $(this).attr("data-langid");
        $("#langid").attr("data-langid", $(this).attr("data-langid"));
        localStorage.perzisterLANGCAPTION = $(this).html();
        Translate();
    });

    function Translate() {
        ConsoleLog('START Translate()');
        $(".translateable").each(function () {
            $(this).html($(this).attr("data-" + $("#langid").attr("data-langid")));
        });
    }

    // ================================================================= theme
   
    //$.backstretch("bg/1.jpg");
   
    $('.backstretch').addClass('hidden-print');
  
    $('.themebtn').click(function () {
        localStorage.perzisterAdditionalCSS = $(this).attr('data-css');
        $("link.additional").attr("href", $(this).attr('data-css'));
        if ($(this).attr('data-css') == '../css/perzister-white.css') {
            $('.backstretch').remove();
            $('.navbar').removeClass('navbar-inverse').addClass('navbar-default'); 
        } else {
            $('.perzister-backstretch-it').backstretch("../bg/1.jpg");
            $('.navbar').removeClass('navbar-default').addClass('navbar-inverse'); 
        }
    });

    if (localStorage.perzisterAdditionalCSS != undefined) {
        $("link.additional").attr("href", localStorage.perzisterAdditionalCSS)
    }
    else {
        $("link.additional").attr("href", '../css/perzister-dark.css')
    }

    
    if ($("link.additional").attr('href') == '../css/perzister-white.css') {
        $('.backstretch').remove();
        $('.navbar').removeClass('navbar-inverse').addClass('navbar-default');
    } else {
        $('.perzister-backstretch-it').backstretch("../bg/1.jpg");
        $('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
    }

    

    // ================================================================= PUSHER


    function Pusherino() {

        Pusher.log = function (message) {
            if (window.console && window.console.log) {
                window.console.log(message);
            }
        };

        var pusher = new Pusher('18c574a87d496f1fc8d3');
        var channel = pusher.subscribe('kc');
        channel.bind('ke', function (data) {
            var obj = eval("(" + data + ')'); // for safe parsing go to : www.json.org/js.html

            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            str = '<div class="forlivesearch">' +
                  '<div class="col-sm-12  appcol"> ' +
                  '<div><div class="pull-left perzister-dimed appicon"><i class="fa fa-bell-o fa-3x"></i></div><span class="text-muted">' + time + '</span> <strong>' + obj.from + '</strong>  <div class=""> ' + obj.msg + '</div></div>' +
                  '</div>' +
                  '</div>'

            $(".notificationitem").prepend(str);

            $("#disablednotificationicon,#activenotificationicon").toggleClass('hide');

            $.gritter.add({
                title: obj.from, text: obj.msg, sticky: false, time: '6000', class_name: ''
            });

        });
    }

    // ================================================================= PUBNUB

    if ($("body").attr('data-perzister-notification') == 'true') {
        PubNubino();
    }

    $("#activenotificationicon,#disablednotificationicon").on('click', function () {
        //$("#notificationitems").html(localStorage.perzisterNotifications);
        var str = '';
        var obj2 = JSON.parse(localStorage.perzisterNotifications);
        
        $.each(obj2.notifications, function (i, item) {
            str = str + '<tr>' +
                     '<td> ' +
                     '<div class="pull-left perzister-dimed appicon"><i class="fa fa-bell-o fa-3x"></i></div>' +
                     '</td> ' +
                     '<td> ' +
                     '<span class="text-muted">' + item.time + '</span> <strong>' + item.from + '</strong>  <div class=""> ' + item.msg + '</div>' +
                     '</td>' +
                     '</tr>'
        }
        );
        $("#notificationitems").html('<table class="table table-hover"><tbody>' + str + '</tbody></table>');
        $("#notificationdialog").modal("show");
    });
    
    //var Msg = {}

    function PubNubino() {

        var numberofnotifications = 0;

        ConsoleLog('START PubNubino()');

        var PUBNUB_demo = PUBNUB.init({
            publish_key: 'pub-c-d7ea558c-9ed2-499a-8813-9c8d0a44259f',
            subscribe_key: 'sub-c-138a37b2-6712-11e4-814d-02ee2ddab7fe'
        });

        $("#disablednotificationicon").toggleClass('invisible');

        PUBNUB_demo.subscribe({
            channel: 'kc',
            message: function (obj) {
                console.log(obj)

                numberofnotifications = numberofnotifications + 1;
                $("#numberofnotifications").html(numberofnotifications);

                $.gritter.add({
                    title: obj.from, text: obj.msg, sticky: false, time: '1500', class_name: ''
                });

                //var obj = eval("(" + data + ')'); // for safe parsing go to : www.json.org/js.html

                var dt = new Date();
                var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

                str = '<div class="forlivesearch">' +
                      '<div class="col-sm-12  appcol"> ' +
                      '<div><div class="pull-left perzister-dimed appicon"><i class="fa fa-bell-o fa-3x"></i></div><span class="text-muted">' + time + '</span> <strong>' + obj.from + '</strong>  <div class=""> ' + obj.msg + '</div></div>' +
                      '</div>' +
                      '</div>'

                //$("#notificationitems").prepend(str);

                $("#disablednotificationicon").addClass('hide');
                $("#activenotificationicon").removeClass('hide');

                
                var jsonStr = localStorage.perzisterNotifications;
                if (jsonStr == undefined) {
                    var jsonStr = '{"notifications":[{"time":"","from":"","msg":""}]}';
                }
                var obj2 = JSON.parse(jsonStr);
                while (obj2['notifications'].length > 10) {
                    obj2['notifications'].shift();
                }
                obj2['notifications'].push({ "time":"" + time + "", "from":"" + obj.from + "", "msg":"" + obj.msg + "" });
                jsonStr = JSON.stringify(obj2);
                localStorage.perzisterNotifications = jsonStr

            }
        });

        setTimeout(function () {
            PUBNUB_demo.publish({
                channel: 'kc',
                message: { "from": "big brother", "msg": "" + localStorage.perzisterU + " just start " + localStorage.perzisterApp + " app" }
            });
        }, 2000);

        setTimeout(function () {
            $("#disablednotificationicon").removeClass('fa-bell-slash-o').addClass('fa-bell-o');
        }, 1000);


        /*
        PUBNUB_demo.history({
            channel: 'kc',
            count: 100,
            callback: function (m) { console.log(m) }
        });
        */


    }

    // ================================================================== CONSOLE LOG

    function ConsoleLog(message) {
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    }


});


