$(document).ready(function () {

    $("#prviekranizv").hide();
    $("#prviekranref").hide();
    $("#drugiekranizv").hide();
    $("#drugiekranref").hide();

    $("#prviekranmaliizv").hide();

    //$("#prvifilter").show();
    //$("#drugifilter").show();

    $("#prvifilterbody").slideDown();
    $("#drugifilterbody").slideDown();


   // $('.multiselect').multiselect();

    // ================================================================================== login ...
    var strCrossDomainServiceURL = '';
    var strGUID = '';
    var strDataBase = '';

    if (typeof localStorage.JRWDGUID == 'undefined' || localStorage.JRWDGUID == 'undefined' || localStorage.JRWDGUID == '0' || localStorage.JRWDGUID == '') {
        TurnONlogin();
    }
    else {
        strGUID = localStorage.JRWDGUID;
        strCrossDomainServiceURL = localStorage.JRWDw;
        strDataBase = localStorage.JRWDd;
        TurnOFFlogin();
    };

    strDataBase = "spin";
    //strDataBase = "spin";

    function TurnONlogin(str) { $("#sectionlogin").show(); $(".off-canvas-wrap").addClass('hide'); $(".logoutrwd").addClass('hide'); strGUID = ""; localStorage.JRWDGUID = '0'; $("#p").val(''); $("#loginserverresponse").html(str); $(".printbutton,.filterbutton,.aboutrwd").hide(); }
    function TurnOFFlogin() { $("#sectionlogin").hide(); $(".off-canvas-wrap").removeClass('hide'); $(".logoutrwd").removeClass('hide'); $(".printbutton,.filterbutton,.aboutrwd").show(); }

    if (localStorage.JRWDe != undefined) $("#e").val(localStorage.JRWDe);
    //if (localStorage.JRWDp != undefined) $("#p").val(localStorage.JRWDp);
    if (localStorage.JRWDd != undefined) $("#d").val(localStorage.JRWDd);
    if (localStorage.JRWDw != undefined) $("#w").val(localStorage.JRWDw);

    $("#buttonlogin").on('click', function () { Login(); });

    function Login() {
        $("#ajaxloader1").show();
        $("#loginserverresponse").html('');

        localStorage.JRWDe = $("#e").val();
        //localStorage.JRWDp = $("#p").val();
        localStorage.JRWDd = $("#d").val();
        strDataBase = $("#d").val();
        localStorage.JRWDw = $("#w").val();

        var strData = $("#loginform").serialize();
        if ($("#w").val() != '') { strCrossDomainServiceURL = $("#w").val(); }
        if (strCrossDomainServiceURL == '') { $("#loginserverresponse").html("<br/><div class='alert-box secondary'><span class='glyphicon glyphicon-shopping-cart'></span><h6>web service is required field</h6></div>"); return; }
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "action=login&" + strData,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                $.each(data, function (i, item) {
                    if (data.errnumber != '0') {
                        $("#loginserverresponse").html("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    }
                    if (data.userguid != '0') {
                        strGUID = data.userguid;
                        localStorage.JRWDGUID = strGUID;
                        TurnOFFlogin();
                    }
                });
                $("#ajaxloader1").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#loginserverresponse").html("<br/><div class='alert-box secondary'><i class='fi-unlink size-28'></i><h6>" + thrownError + ' ' + xhr.status + '</h4></div>');
            }
        });
    }

    $(".logoutrwd").on('click', function () { TurnONlogin(''); });
    $("#buttonsettings").on('click', function () { $("#settingsfields").toggle(); });

    // =============================================================================== generalije ...
 
    var indekran = 0;

    if ($("#prvifilter div:first-child").css('display') == 'none') {
        indekran = 1;
    }


    $('form').submit(function (e) { e.preventDefault(); return false; });

    $(".printdoc").on('click', function () { window.print(); return false; });

    $("#drugiekranizvprint").on('click', function () {

        // $(".drugifilter").css("display", "none");
       

        window.print();

        return false;
    });

    //$(".theme").on('click', function () {
    //    localStorage.JRWDbackstretch = $(this).attr('data-id');
    //    if ($(this).attr('data-id') == "0") { $.backstretch('destroy', false); } else { $.backstretch([$(this).attr('data-id')]); $(".backstretch").addClass('hide-for-print'); }
    //});

    //$.backstretch([localStorage.JRWDbackstretch]);

    //$(".backstretch").addClass('hide-for-print');

    strCrossDomainServiceURL = "http://www.spin.hr/ng/rwd3service";



    (function () {
        'use strict';
        var $ = jQuery;
        $.fn.extend({
            filterTable: function () {
                return this.each(function () {
                    $(this).on('keyup', function (e) {
                        $('.filterTable_no_results').remove();
                        var $this = $(this), search = $this.val().toLowerCase(), target = $this.attr('data-filters'), $target = $(target), $rows = $target.find('tbody tr');
                        if (search == '') {
                            $rows.show();
                        } else {
                            $rows.each(function () {
                                var $this = $(this);
                                $this.text().toLowerCase().indexOf(search) === -1 ? $this.hide() : $this.show();
                            })
                            if ($target.find('tbody tr:visible').size() === 0) {
                                var col_count = $target.find('tr').first().find('td').size();
                                var no_results = $('<tr class="filterTable_no_results"><td colspan="' + col_count + '">No results found</td></tr>')
                                $target.find('tbody').append(no_results);
                            }
                        }
                    });
                });
            }
        });
        $('[data-action="filter"]').filterTable();
    })(jQuery);

    $(document).on('click', '.panel-heading span.clickable', function (e) {
        var $this = $(this);
        if (!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            if (!$this.hasClass('filter')) {
                $("#formaizvclick1").parents('.panel').find('.panel-body').slideUp();
            }
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            if (!$this.hasClass('filter')) {
                $("#formaizvclick1").parents('.panel').find('.panel-body').slideDown();
            }
        }
    })



    //$(".panel-heading span.clickable").click();
    //$(".panel-heading span.clickable").click();
    //$("#prvifilterbody").slideDown();
    //$("#drugifilterbody").slideDown();

    $("#prvifilter").show();
    $("#drugifilter").show();

    //$(function () {
    //    // attach table filter plugin to inputs
    //    $('[data-action="filter"]').filterTable();

    //    $('.container').on('click', '.panel-heading span.filter', function (e) {
    //        var $this = $(this),
    //                $panel = $this.parents('.panel');

    //        $panel.find('.panel-body').slideToggle();
    //        if ($this.css('display') != 'none') {
    //            $panel.find('.panel-body input').focus();
    //        }
    //    });
    //    $('[data-toggle="tooltip"]').tooltip();
    //})

    
 
    //$("#prviekran").hide();
    //$("#drugiekran").hide();



    $(".frmizvizbor li").on("click", function () {
        $(".frmizvizbor li").removeClass("active");
        $(this).addClass("active");
    });

    $(".frmrefizbor li").on("click", function () {
        $(".frmrefizbor li").removeClass("active");
        $(this).addClass("active");
    });

    $(".toggle-slide-left").on("click", function () {
        if (!$('.navbar-toggle').hasClass('collapsed')) {
            $(".navbar-toggle").trigger("click");
        }
    });

    $(".toggle-slide-right").on("click", function () {
        if (!$('.navbar-toggle').hasClass('collapsed')) {
            $(".navbar-toggle").trigger("click");
        }
    });

    $("#btnizv").click(function () {
        GetRezIzv(false, indekran);
        //$("#prviekranmaliizv").show();
        $("#drugiekranmaliizv").show();
        $(".toggle-slide-left").click();
    });

    $("#btnref").click(function () {
        GetRezIzv(true, indekran);
        $("#prviekranmaliref").show();
        $(".toggle-slide-right").click();
    });

    $("#frmbtnizv").click(function () {
        GetRezIzv(false);
    });

    //$("#btnref").click(function () {
    //    $(".toggle-slide-right").click();
    //});

    $("#frmbtnref").click(function () {
        GetRezIzv(true);
    });

    $("#mnuprviekran").click(function () {
        $("#drugiekran").hide();
        $("#prviekran").show();
    });

    $("#mnukup").click(function () {
        $("#prviekran").hide();
        $("#drugiekran").show();
    });

    $("#frmbtnizvzbirno").click(function () {
        $("#drugiekranizv").hide();
        $("#prviekranizv").show();
    });

    $("#frmbtnizvkupci").click(function () {
        $("#prviekranizv").hide();
        $("#drugiekranizv").show();

    });

    $("#frmbtnrefzbirno").click(function () {
        $("#drugiekranref").hide();
        $("#prviekranref").show();
    });

    $("#frmbtnrefkupci").click(function () {
        $("#prviekranref").hide();
        $("#drugiekranref").show();

    });

    //$("#prvifilter").show();
    //$("#drugifilter").show();

    function GetRezIzv(indr, indekr) {
        //alert("1");
        var strData = $("#filterform").serialize();
        //alert(strData);
        //var datodiz = "@dat1=" + $('#datodizv').data("DateTimePicker").getDate();
        var datodiz = $('#datodizv').data("DateTimePicker").getDate();
        //alert(datodiz._i);
        //var dod = "dat1=";
        var dod = "";
        dod = dod + datodiz._i
        //alert(dod);

        var datdoiz = $('#datdoizv').data("DateTimePicker").getDate();
        //alert(datdoiz._i);
        //var ddo = "dat2=";
        var ddo = "";
        ddo = ddo + datdoiz._i
        //alert(ddo);
        
        var docizv = $('#izbizv').val();

        var klizv = $('#klasaizv').val();

        var orizv = $('#orgshemaizv').val();

        var osizv = $('#odgosobaizv').val();
        //alert(osizv);

        //orizv = "0101";
        //klizv = "0101";

        var strFormattedTABLE = "";
        var strFormattedROWS = "";

        var saj = "&datumod=" + dod + "&datumdo=" + ddo + "&s=" + orizv + "&s1=" + klizv + "&id=" + osizv

        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=mananapro1" + saj,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }

                var rowcount = data.length - 1;


                $.each(data, function (i, item) {

                    if (indekr == 1) {

                    }
                    else {

                        strFormattedROWS = strFormattedROWS + '<tr class="forlivesearchizv1"><td><b>Izdano</b></td><td>' + item.vr1 + '</td><td>' + item.vr2 + '</td><td>' + item.vr3 + '</td><td>0.00</td><td>0.00</td></tr>';

                        if (i == rowcount) { // zadnji
                            strFormattedTABLE = strFormattedTABLE + '<table  class="table"><thead><tr><th></th><th>Količina</th><th>Vrijednost</th><th>RUC</th><th>Prosiječna<br/>vrijednost</th><th>% RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                        }
                    }

                });

                if (indr == false) {
                    $("#listaizv1").html(strFormattedTABLE);
                    if (indekr == 1) {
                        //$("#prviekranmaliizv").show();
                    }
                    else {
                        $("#prviekranizv").show();
                    }

                    
                    GetRezIzv2(false, indekr);
                }
                else {
                    $("#listaref1").html(strFormattedTABLE);

                    if (indekr == 1) {
                        $("#prviekranmaliref").show();
                    }
                    else {
                        $("#prviekranref").show();
                    }


                    GetRezIzv2(true, indekr);
                }
                
               
                //$(".toggle-slide-left").click();
                
                

                

            },
            error: function (xhr, ajaxOptions, thrownError) {

                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

    }


    function GetRezIzv2(indref, indekr) {
        var strData = $("#filterform").serialize();
        //alert(strData);
        //var datodiz = "@dat1=" + $('#datodizv').data("DateTimePicker").getDate();
        var datodiz = $('#datodizv').data("DateTimePicker").getDate();
        //alert(datodiz._i);
        //var dod = "dat1=";
        var dod = "";
        dod = dod + datodiz._i
        //alert(dod);

        var datdoiz = $('#datdoizv').data("DateTimePicker").getDate();
        //alert(datdoiz._i);
        //var ddo = "dat2=";
        var ddo = "";
        ddo = ddo + datdoiz._i
        //alert(ddo);

        var docizv = $('#izbizv').val();

        var klizv = $('#klasaizv').val();

        var orizv = $('#orgshemaizv').val();

        var osizv = $('#odgosobaizv').val();
        //alert(osizv);

        //orizv = "0101";
        //klizv = "0101";

        var strFormattedTABLE = "";
        var strFormattedROWS = "";

        var saj = "&datumod=" + dod + "&datumdo=" + ddo + "&s=" + orizv + "&s1=" + klizv + "&id=" + osizv

        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=mananapro3" + saj,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }

                var rowcount = data.length - 1;


                $.each(data, function (i, item) {

                    if (indekr == 1) {

                        strFormattedROWS = strFormattedROWS + '<div class="panel forlivesearchkupmali1">'
                            + '<h5 class="media-heading text-center forlivesearchkupmali1">Partner:</h5>'
                            + '<h4 class="media-heading text-center forlivesearchkupmali1">' + item.Partner + '</h4>'
                            + '<h5 class="media-heading text-center">Netto vrijednost:</h5>'
                            + '<h4 class="media-heading text-center forlivesearchkupmali1">' + item["Neto Vrijednost"] + '</h4>'
                            + '<ul class="list-inline mrg-0 btm-mrg-10 clr-535353 text-center">'
                            + '<li>RUC<br /><b>' + item.RUC + '</b></li>'
                            + '<li style="list-style: none"></li>'
                            +  '<li>RUC<br /><b>' + item["%RUC"] + '</b></li>'
                            + '</ul>'
                            + '</div>';



                    }
                    else {

                        if (indref == false) {


                            strFormattedROWS = strFormattedROWS + '<tr class="forlivesearchkupizv1"><td>' + item.Partner + '</td><td>' + item["Neto Vrijednost"] + '</td><td>' + item.RUC + '</td><td>' + item["%RUC"] + '</td></tr>';

                            if (i == rowcount) { // zadnji
                                strFormattedTABLE = strFormattedTABLE + '<table  class="table table-hover" id="tablekupizv"><thead><tr><th>Partner</th><th>NetoVrijednost</th><th>RUC</th><th>% RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                            }
                        }
                        else {
                            strFormattedROWS = strFormattedROWS + '<tr class="forlivesearchkupref1"><td>' + item.Partner + '</td><td>' + item["Neto Vrijednost"] + '</td><td>' + item.RUC + '</td><td>' + item["%RUC"] + '</td></tr>';

                            if (i == rowcount) { // zadnji
                                strFormattedTABLE = strFormattedTABLE + '<table  class="table table-hover" id="tablekupref"><thead><tr><th>Partner</th><th>NetoVrijednost</th><th>RUC</th><th>% RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                            }
                        }
                    }

                });

                if (indekr == 1) {

                    if (indref == false) {

                        $("#listakupmaliizv1").html(strFormattedROWS);

                    }
                    else {

                        $("#listakupmaliref1").html(strFormattedROWS);

                    }

                    $('#search').fastLiveFilter('.forlivesearchkupmali1');

                }
                else {

                    if (indref == false) {

                        $("#listakupizv1").html(strFormattedTABLE);


                        $('#tablekupizv').dataTable({
                            "sPaginationType": "bs_normal"
                        });
                        $('#tablekupizv').each(function () {
                            var datatable = $(this);
                            // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                            var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                            search_input.attr('placeholder', 'Search');
                            search_input.addClass('form-control input-sm');
                            // LENGTH - Inline-Form control
                            var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                            length_sel.addClass('form-control input-sm');
                            datatable.bind('page', function (e) {
                                window.console && console.log('pagination event:', e) //this event must be fired whenever you paginate
                            });
                        });
                    }
                    else {
                        $("#listakupref1").html(strFormattedTABLE);

                        $('#tablekupref').dataTable({
                            "sPaginationType": "bs_normal"
                        });
                        $('#tablekupref').each(function () {
                            var datatable = $(this);
                            // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                            var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                            search_input.attr('placeholder', 'Search');
                            search_input.addClass('form-control input-sm');
                            // LENGTH - Inline-Form control
                            var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                            length_sel.addClass('form-control input-sm');
                            datatable.bind('page', function (e) {
                                window.console && console.log('pagination event:', e) //this event must be fired whenever you paginate
                            });
                        });
                    }
                }
  

            },
            error: function (xhr, ajaxOptions, thrownError) {

                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

    }


    if (indekran == 1) {
        PopuniFilterForme(1);
    }
    else {
        PopuniFilterForme();
    }

    //PopuniFilterForme();

    function PopuniFilterForme(indikator) {

        var strFormattedTABLE = "";
        var space = "";


        strFormattedTABLE = '<option  value="p">Ponude</option>'
                            + '<option  value="o">Otprema</option>'
                            + '<option  value="f">Fakture</option>'
                            + '<option  value="m">Maloprodaja</option>'
                            + '<option  value="v">VP + MP</option>';

        $('#frmizbizv').append(strFormattedTABLE);
        $('#frmizbizv').multiselect({
            includeSelectAllOption: false,
            maxHeight: 150,
            buttonWidth: '100%'
        });

        $('#frmizbref').append(strFormattedTABLE);
        $('#frmizbref').multiselect({
            includeSelectAllOption: false,
            maxHeight: 150,
            buttonWidth: '100%'
        });

        $('#izbizv').append(strFormattedTABLE);
        $('#izbizv').multiselect({
            includeSelectAllOption: false,
            maxHeight: 150,
            buttonWidth: '300px'
        });



        $('#izbref').append(strFormattedTABLE);
        $('#izbref').multiselect({
            includeSelectAllOption: false,
            maxHeight: 150,
            buttonWidth: '300px'
        });

        strFormattedTABLE = "";

        //for (var i = 1; i <= 100; i++) {
        //    $('#example28').append('<option value="' + i + '">' + i + '</option>');
        //}



        $('#datodizv').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-01-01"
        });
        $('#datdoizv').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-04-08"
        });

        $('#frmdatodizv').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-01-01"
        });
        $('#frmdatdoizv').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-04-08"
        });

        $('#datodref').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-01-01"
        });
        $('#datdoref').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-04-08"
        });

        $('#frmdatodref').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-01-01"
        });
        $('#frmdatdoref').datetimepicker({
            language: 'hr',
            pickTime: false,
            defaultDate: "2013-04-08"
        });

        //alert(strGUID);

        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=manana1",
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }



                strFormattedTABLE = '<option value="%">Izaberi</option>';

                

                $.each(data, function (i, item) {

                    space = "";

                    for (var i = 0; i < item.SortKey.length; i++) {
                        space = space + '&nbsp;';
                    }

                    strFormattedTABLE = strFormattedTABLE + '<option value="' + item.SortKey + '%">' + space + item.Naziv + '</option>'


                });

                
 
                if (indikator == 1) {

                    $('#klasaizv').append(strFormattedTABLE);
                    $('#klasaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });



                    $('#klasaref').append(strFormattedTABLE);
                    $('#klasaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });

                }
                else {

                    $('#frmklasaizv').append(strFormattedTABLE);
                    //alert("prije3");
                    $('#frmklasaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });
                    //alert("prije4");

                    $('#frmklasaref').append(strFormattedTABLE);
                    $('#frmklasaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });

                }



                //$("#prvifilter").show();
                //$("#drugifilter").show();


                //$('#klasaizv').append(strFormattedTABLE);
                //$('#klasaizv').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});



                //$('#klasaref').append(strFormattedTABLE);
                //$('#klasaref').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});

            },
            error: function (xhr, ajaxOptions, thrownError) {
 
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=manana2",
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }



                strFormattedTABLE = '<option value="%">Izaberi</option>';

                $.each(data, function (i, item) {

                    space = "";

                    for (var i = 0; i < item.SortKey.length; i++) {
                        space = space + '&nbsp;';
                    }

                    strFormattedTABLE = strFormattedTABLE + '<option value="' + item.SortKey + '%">' + space + item.Naziv + '</option>'


                });

                if (indikator == 1) {

                    $('#orgshemaizv').append(strFormattedTABLE);
                    $('#orgshemaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });


                    $('#orgshemaref').append(strFormattedTABLE);
                    $('#orgshemaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });

                }
                else {
                    $('#frmorgshemaizv').append(strFormattedTABLE);
                    $('#frmorgshemaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });

                    $('#frmorgshemaref').append(strFormattedTABLE);
                    $('#frmorgshemaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });
                }

                //$('#orgshemaizv').append(strFormattedTABLE);
                //$('#orgshemaizv').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});


                //$('#orgshemaref').append(strFormattedTABLE);
                //$('#orgshemaref').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});

                //dropRight: true

            },
            error: function (xhr, ajaxOptions, thrownError) {

                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=manana3",
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }



                strFormattedTABLE = '<option value="-1">Izaberi</option>';

                $.each(data, function (i, item) {


                    strFormattedTABLE = strFormattedTABLE + '<option value="' + item.OsobeId + '">' + item.Naziv + '</option>'


                });



                if (indikator == 1) {

                    $('#odgosobaizv').append(strFormattedTABLE);
                    $('#odgosobaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        buttonContainer: '<span class="dropdown" />',
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });


                    $('#odgosobaref').append(strFormattedTABLE);
                    $('#odgosobaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        buttonContainer: '<span class="dropdown" />',
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '300px'
                    });

                }
                else {

                    $('#frmodgosobaizv').append(strFormattedTABLE);
                    $('#frmodgosobaizv').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        buttonContainer: '<span class="dropdown" />',
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });

                    $('#frmodgosobaref').append(strFormattedTABLE);
                    $('#frmodgosobaref').multiselect({
                        includeSelectAllOption: false,
                        enableFiltering: true,
                        maxHeight: 150,
                        buttonContainer: '<span class="dropdown" />',
                        enableCaseInsensitiveFiltering: true,
                        buttonWidth: '100%'
                    });
                }

                //$('#odgosobaizv').append(strFormattedTABLE);
                //$('#odgosobaizv').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    buttonContainer: '<span class="dropdown" />',
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});


                //$('#odgosobaref').append(strFormattedTABLE);
                //$('#odgosobaref').multiselect({
                //    includeSelectAllOption: false,
                //    enableFiltering: true,
                //    maxHeight: 150,
                //    buttonContainer: '<span class="dropdown" />',
                //    enableCaseInsensitiveFiltering: true,
                //    buttonWidth: '300px'
                //});

                //$(".toggle-slide-left").click();
                //$(".toggle-slide-right").click();

                //$("#prvifilter").show();
                //$("#drugifilter").show();

            },
            error: function (xhr, ajaxOptions, thrownError) {

                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

    }




});