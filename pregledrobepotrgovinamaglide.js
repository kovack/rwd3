﻿$(document).ready(function () {
    // ================================================================================== history ...
    // kk 20.02.2014.
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
            url: strCrossDomainServiceURL ,
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
    var glide;

    $("#homelogo").on("click", function () {
        var glide = $('.slider').glide().data('api_glide');
        glide.jump(1, console.log('Wooo!'));
        //glide.reinit();
    })

    $('form').submit(function (e) { e.preventDefault(); return false; });

    $(".printdoc").on('click', function () { window.print(); return false; });
   
    $(".theme").on('click', function () {
        localStorage.JRWDbackstretch = $(this).attr('data-id');
        if ($(this).attr('data-id') == "0") { $.backstretch('destroy', false); } else { $.backstretch([$(this).attr('data-id')]); $(".backstretch").addClass('hide-for-print'); }
    });

    $.backstretch([localStorage.JRWDbackstretch]);

    $(".backstretch").addClass('hide-for-print');
        
    $("#search").on('keypress', function () {
        var glide2 = $('.slider').glide().data('api_glide');
        glide2.jump(2, console.log('Wooo!'));
    });

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });
    // ============================================================================= GET JSON DATA & format HTML ...

    $('#filterform').submit(function (e) { GetList($("#search").val()); });

    function GetList(search) {
        $(".mojsection").hide();
        $("#sectionlist").show('slow');
        var strFormattedTABLE = "";
        var strFormattedROWS = "";
        $("#lista").html('');
        $("#ajaxloader1").show();
        var strData= $("#filterform").serialize();
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=robapotrgovinama&" + strData,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber !='undefined' && data.errnumber != '0') {
                    $("#ajaxloader1").hide();
                    $("#lista").html('');
                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = '';} 
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }
                arrDataForPieChart = [];
                var j = "";
                var k = 0;
                var rowcount = data.length - 1;
                var trgovinaId = 0;
                var trgovinanaziv = "";
                var ukupnovrijednost = 0;
                $.each(data, function (i, item) {
                    k = k + 1;
                    strFormattedROWS = strFormattedROWS + '<tr class="forlivesearch"><td>' + item.roba + '</td><td>' + item.kolicina + '</td><td>' + item.netovrijednost + '</td><td>' + item.ruc + '</td></tr>';
                    ukupnovrijednost = ukupnovrijednost + parseFloat(item.kolicina * item.netovrijednost);
                    if (j != item.trgovina) {  // zaglavlje
                        if (j != "") {
                            strFormattedTABLE = strFormattedTABLE + '<table id="table' + trgovinaId + '" class="table hide table-condensed"><thead><tr><th>Roba</th><th>Količina</th><th>Neto</th><th>RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                            strFormattedROWS = '';
                            k = 0;
                            arrDataForPieChart.push([trgovinanaziv, parseFloat(ukupnovrijednost.toFixed(2))]);
                            ukupnovrijednost = 0;
                        }
                        strFormattedTABLE = strFormattedTABLE + '<div class="alert alert-dismissable alert-info tablecaption" data-id="' + item.trgovinaId + '"><span class="glyphicon glyphicon-shopping-cart"></span> <strong> ' + item.trgovina + '</strong><button href="#" data-id="' + item.trgovinaId + '" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>';
                        j = item.trgovina;
                        trgovinanaziv = item.trgovina;
                    };
                    trgovinaId = item.trgovinaId;
                    if (i == rowcount) { // zadnji
                        strFormattedTABLE = strFormattedTABLE + '<table style="width:100%;" id="table' + trgovinaId + '" class="table hide"><thead><tr><th>Roba</th><th>Količina</th><th>Neto</th><th>RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                        arrDataForPieChart.push([trgovinanaziv, parseFloat(ukupnovrijednost.toFixed(2))]);
                    }
                });
                $("#ajaxloader1").hide();
                $("#lista").html(strFormattedTABLE); // insert into DOM
                $(".tablecaption").on('click', function () { $("#table" + $(this).attr("data-id")).toggleClass('hide'); }); // event registration
                $(".close").on('click', function () { $(this).parent().hide(''); $("#table" + $(this).attr("data-id")).hide(); }); // event registration
                $('#search').fastLiveFilter('tbody'); // local fast live search
                PieChart();
                //glide.reinit();
                //glide.next();
                //glide.next();


                $('.slider').glide({
                    autoplay: false,
                    arrows: false,
                    navigation: true,
                    nav: 'html',
                    navigationCenter: true,
                    arrowRightText: '<span class="glyphicon glyphicon-chevron-right"></span>',
                    arrowLeftText: '<span class="glyphicon glyphicon-chevron-left"></span>',
                    afterTransition: function () {
                        // alert()
                        if (glide.current() == 1 || glide.current() == 3) { $(window).scrollTop(0); };
                        if (glide.current() == 3) { $(window).resize();};
                        
                    }
                });
                
                $('#appcaption').addClass('hide');
                $('.slide,#search').removeClass('hide');
                var glide = $('.slider').glide().data('api_glide');
                glide.next();
                $(window).resize();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }


    // ============================================================================= chart ...

    $(".chart").on('click', function () {
        $(".mojsection").hide();
        $("#sectionchart").show('slow');
        $(".left-off-canvas-toggle").click();
        PieChart();
        //StackedColumn();
    });

    var arrDataForPieChart = [];

    function PieChart() {
        $("#sectionchart").show('slow');
        

        // Build the chart
        var chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'container1',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Vrijednost robe po trgovinama'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function () {
                            return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'vrijednost robe',
                data: arrDataForPieChart
            }]
        });

        //chart1 = new Highcharts.Chart(chartOptions);

    }


    
     

});


