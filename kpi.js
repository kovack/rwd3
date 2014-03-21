$(document).ready(function () {
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

    strDataBase = "spin27012014";

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

    $('.slider').glide({
        autoplay: false,
        arrows: false,
        navigation: true,
        nav: 'html',
        navigationCenter: true,
        arrowRightText: '<span class="glyphicon glyphicon-chevron-right"></span>',
        arrowLeftText: '<span class="glyphicon glyphicon-chevron-left"></span>'
    });

    // ============================================================================= GET JSON DATA & format HTML ...

    GetPokazatelj1(25);

    function GetPokazatelj1(OperaterId) {
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=kpi1&operateriid=" + OperaterId,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            async: false,
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {
                    
                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }

                $.each(data, function (i, item) {

                    //if (i==3) GetPokazatelj2(item.ManPokazateljiId, OperaterId);
                    //if (i == 1) GetPokazatelj2(1, OperaterId);
                    GetPokazatelj2(item.ManPokazateljiId, OperaterId);

                });


            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }

    function GetPokazatelj2(ManPokazateljiId, OperaterId) {
        var strData = $(".datumforma").serialize();
        var pr1 = "g=" + strGUID + "&d=" + strDataBase + "&action=kpjot&id=" + ManPokazateljiId + "&" + strData;
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=kpjot&id=" + ManPokazateljiId + "&" + strData,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            async: false,
            timeout: 10000,
            success: function (data, status) {
                if (typeof data.errnumber != 'undefined' && data.errnumber != '0') {

                    if (data.errnumber != '0') { strGUID = ''; localStorage.JRWDGUID = ''; }
                    TurnONlogin("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>" + data.errdescription + '</h6></div>');
                    return;
                }

                
                $.each(data, function (i, item) {

                    var strFormattedTABLE = "";

                    strFormattedTABLE = strFormattedTABLE + '<div class="col-sm-4"><div class="panel panel-primary">' +
                                        '<div class="panel-heading">' +
                                        '<h5 class="panel-title">' + item.naziv + '</h5>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                        '<h4>' + item.gadnaziv1 + " " + item.gadiznos1 + '</h4>' +
                                        '<div id="bsjChartContainer' + item.manpokazateljiid + '"  ></div>' +
                                        '<span >' + item.gadnaziv2 + '</span>' +
                                        '<span style="float: right" >' + item.gadiznos2 + '</span><br/>' +
                                        '<span >' + item.gadnaziv3 + '</span>' +
                                        '<span style="float: right">' + item.gadiznos3 + '</span><br/>' +
                                        '<span >' + item.gadnaziv4 + '</span>' +
                                        '<span style="float: right">' + item.gadiznos4 + '</span>' +
                                        '</div></div></div>';

                    $("#lista").append(strFormattedTABLE);

                    PieChart(item.gadiznos5, 'bsjChartContainer' + item.manpokazateljiid, '', parseFloat(item.iznosdobro), parseFloat(item.iznoslose));



                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }


    //GetList("");

    $('#filterform').submit(function (e) { GetList($("#search").val()); });


    // ============================================================================= chart ...

    $(".chart").on('click', function () {
        $(".mojsection").hide();
        $("#sectionchart").show('slow');
        $(".left-off-canvas-toggle").click();
        PieChart();
        //StackedColumn();
    });

    var arrDataForPieChart = [];

    function PieChart(iznos, cont, naz, IznosDobro, IznosLose) {
        //$("#sectionchart").show('slow');

        var pod = [iznos];
        // Build the chart

        var Prosjek = parseFloat((IznosDobro + IznosLose) / 2);

        var MaxVrijednost = Prosjek + 2 * (IznosDobro - Prosjek);
        var MinVrijednost = Prosjek - 2 * (IznosDobro - Prosjek);

        $(function () {
            $('#' + cont).highcharts({

                chart: {
                    type: 'gauge',
                    height: 100,
                    plotBorderWidth: 1,
                    plotBackgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, '#DDD'],
                            [1, '#FFF']
                        ]
                    },
                    plotBackgroundImage: null
                },

                title: {
                    text: ''
                },

                pane: [{
                    startAngle: -45,
                    endAngle: 45,
                    background: null,
                    center: ['50%', '145%'],
                    size: 200
                }],

                yAxis: [{
                    min: MinVrijednost,
                    max: MaxVrijednost,
                    tickPosition: 'inside',
                    lineWidth: 2,
                    labels: {
                        enabled: false
                    },
                    plotBands: [{
                        from: MinVrijednost,
                        to: IznosLose,
                        color: 'green',
                        innerRadius: null,
                        outerRadius: null
                    }, {
                        from: IznosLose,
                        to: IznosDobro,
                        color: 'yellow',
                        innerRadius: null,
                        outerRadius: null
                    }, {
                        from: IznosDobro,
                        to: MaxVrijednost,
                        color: 'red',
                        innerRadius: null,
                        outerRadius: null
                    }],
                    pane: 0,
                    title: {
                        text: '',
                        y: -20
                    }
                }],

                plotOptions: {
                    gauge: {
                        dataLabels: {
                            enabled: false
                        },
                        dial: {
                            radius: '100%'
                        }
                    }
                },


                series: [{
                    data: pod
                }]

            });
        });




    }


    
     

});


