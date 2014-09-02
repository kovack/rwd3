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
        arrowLeftText: '<span class="glyphicon glyphicon-chevron-left"></span>',
        afterTransition: function () {
            $(window).scrollTop(0);
        }
    });

    var glide = $('.slider').glide().data('api_glide');
    glide.jump(1, console.log('Wooo!'));

    // ============================================================================= GET JSON DATA & format HTML ...

    strCrossDomainServiceURL = "http://www.spin.hr/ng/rwd3service";

    GetPokazatelj1(25);

    //$('.datumforma').submit(function (e) { GetPokazatelj1(25); });
    $('#datumdo').change(function(e) { GetPokazatelj1(25); $(".navbar-toggle").click(); });


    function GetPokazatelj1(OperaterId) {
        //$("#lista").hide();
        $("#ajaxloaderzagraf1").show();

        $("#grafikon").html('');
        $("#lista").html('');
        glide.jump(1);

        //alert("g=" + strGUID + "&d=" + strDataBase + "&action=kpi1&operateriid=" + OperaterId);

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

                //alert(1);

                $.each(data, function (i, item) {

                    //if (i==3) GetPokazatelj2(item.ManPokazateljiId, OperaterId);
                    //if (i == 1) GetPokazatelj2(1, OperaterId);
                    GetPokazatelj2(item.ManPokazateljiId, OperaterId);

                });

                $("#ajaxloaderzagraf1").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloaderzagraf1").hide();
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

                //alert(2);

                $.each(data, function (i, item) {

                    var strFormattedTABLE = "";
                    var g1 = numeral(item.gadiznos1).format('0,0');
                    var g2 = numeral(item.gadiznos2).format('0,0');
                    var g3 = numeral(item.gadiznos3).format('0,0');
                    var g4 = numeral(item.gadiznos4).format('0,0');

                    strFormattedTABLE = strFormattedTABLE + '<div class="col-sm-4"><div class="panel panel-primary">' +
                                        '<div class="panel-heading">' +
                                        '<h5 class="panel-title">' + item.naziv + '</h5>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                        '<span ><font size="5">' + item.gadnaziv1 + '</font></span>' +
                                         '<span style="float: right" ><font size="5">' + g1.replace(/,/g, ".") + '</font></span><br/>' +
                                        '<div id="bsjChartContainer' + item.manpokazateljiid + '"  ></div>' +
                                        '<span >' + item.gadnaziv2 + '</span>' +
                                        '<span style="float: right" >' + g2.replace(/,/g, ".") + '</span><br/>' +
                                        '<span >' + item.gadnaziv3 + '</span>' +
                                        '<span style="float: right">' + g3.replace(/,/g, ".") + '</span><br/>' +
                                        '<span >' + item.gadnaziv4 + '</span>' +
                                        '<span style="float: right">' + g4.replace(/,/g, ".") + '</span>' +
                                        '</div></div></div>';

                    $("#lista").append(strFormattedTABLE);

                    PieChart(item.gadiznos5, 'bsjChartContainer' + item.manpokazateljiid, item.gadnaziv5, parseFloat(item.iznosdobro), parseFloat(item.iznoslose));



                });

                //$("#ajaxloaderzagraf1").hide();
                //$("#lista").show();

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }

    function formatbroj(broj) {
        //var num = new NumberFormat();
        //num.setNumber(broj);
        var num = broj.toFixed(0);
    }

    //GetList("");

    $('#filterform').submit(function (e) { GetList($("#search").val()); });

    // ============================================================================= grafikon ...

    var setovi = [];
    var grafikoni = [];

    GetSetovi(25);

    function GetSetovi(OperaterId) {
        var pr = "g=" + strGUID + "&d=" + strDataBase + "&action=kpi7&id=" + OperaterId;
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=kpi7&id=" + OperaterId,
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
                    // obrada prvog recorseta
                    if (i == 0) {
                            setovi = item;
                    }

                    // obrada drugog recorseta

                    if (i == 1) {
                            grafikoni = item;
                    }

                });

                var strgl = "";
                var formatiraniHTML = "";
                var DatumDo = new Date();

                var strData = $(".datumforma").serialize();

                var strdatum = strData.replace("datumdo=", "");

                var DatumDo = new Date("'" + strdatum + "'");
                //var DatumDo = new Date();



                $.each(setovi, function (index, value) {
                    var strdet = "";

                    formatiraniHTML = formatiraniHTML
                      + '<h2>'
                     + '&nbsp;&nbsp;' + value.Naziv
                     + '</h2>';
                     


                    $.each(grafikoni, function (g_index, g_value) {
                        if (value.ManPokSetId == g_value.ManPokSetId) {

                            var Korak = "";
                            switch (g_value.Korak)
                            {
                                case "Tromjesjeèje":
                                    Korak = "Tromjesjecje";
                                    break;
                                case "Polugodište":
                                    Korak = "Polugodiste";
                                    break;
                                default:
                                    Korak = g_value.Korak;
                            }

                            var PeriodKorak = "";
                            switch (g_value.PeriodKorak)
                            {
                                case "Tromjesjeèje":
                                    PeriodKorak = "Tromjesjecje";
                                    break;
                                case "Polugodište":
                                    PeriodKorak = "Polugodiste";
                                    break;
                                default:
                                    PeriodKorak = g_value.PeriodKorak;
                            }

                            var lngBrojDana = BrojDana(g_value.PeriodRazdoblje, PeriodKorak.trim());
                            var PeridoDatum = PocetakPerioda(lngBrojDana, PeriodKorak.trim(), DatumDo)

                            var someFormattedDate = DatumDo.toISOString();

                            var i = someFormattedDate.indexOf("T");

                            var dat = someFormattedDate.substring(0, i);
                            var datret = dat.replace(/-/g, "");

                            formatiraniHTML = formatiraniHTML + '<div class="forlivesearch"><div class="col-md-4 "><div class="mojitem1 clearfix thumbnail " style="color:#000;" data-manpokgrafikonid="' + g_value.ManPokGrafikonId + '"'
                             + ' data-datod="' + PeridoDatum + '"'
                             + ' data-datdo="' + datret + '"'
                             + ' data-korak="' + Korak.trim() + '"'
                             + ' data-operateriid="' + OperaterId + '"'
                             + ' data-naziv="' + g_value.Naziv.trim() + '"'
                             + ' data-tip="' + g_value.Tip + '"'
                             + '>'
                             + '<div class="robanaslov">'
                             + '<h5><span class="glyphicon glyphicon-stats"></span> ' + g_value.Naziv + '</h5>'
                             + '</div>'
                             + '</div></div></div>';
                        }
                    });

                    formatiraniHTML = formatiraniHTML + '<div class="clearfix"></div>';
                    
                    //strgl = strgl + '<li role="presentation" class="dropdown-header">' + value.Naziv + '</li>' + strdet;
                    //if (index < setovi.length) {
                    //    strgl = strgl + '<li role="presentation" class="divider"></li>';
                    //}

                });

                //$("#setlista").html(strgl);
                $("#izbor").html(formatiraniHTML);

                $(".mojitem1").on('click', function () {
                    //alert($(this).attr('data-manpokgrafikonid'));
                    KreirajGrafikon($(this).attr('data-datod'), $(this).attr('data-datdo'), $(this).attr('data-korak'), $(this).attr('data-manpokgrafikonid'), $(this).attr('data-operateriid'), $(this).attr('data-naziv'), $(this).attr('data-tip'));
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }

    function PocetakPerioda(BrojDana, Oznaka, Datum) {

        var myDate = new Date();
        myDate.setTime(Datum - BrojDana * 86400000);

        var dtDatum = new Date();

        switch (Oznaka)
        {
            case "Dan":
                dtDatum = myDate;
                break;
            case "Mjesec":
                dtDatum.setFullYear(myDate.getFullYear(), myDate.getMonth() + 1, 1);
                break;
            case "Tromjesječje":
                dtDatum.setFullYear(myDate.getFullYear(), ~~(myDate.getMonth() / 3) * 3 + 1, 1);
                break;
            case "Tromjesjecje":
                dtDatum.setFullYear(myDate.getFullYear(), ~~(myDate.getMonth() / 3) * 3 + 1, 1);
                break;
            case "Kvartal":
                dtDatum.setFullYear(myDate.getFullYear(), ~~(myDate.getMonth() / 4) * 4 + 1, 1);
                break;
            case "Polugodište":
                dtDatum.setFullYear(myDate.getFullYear(), ~~(myDate.getMonth() / 6) * 6 + 1, 1);
                break;
            case "Polugodiste":
                dtDatum.setFullYear(myDate.getFullYear(), ~~(myDate.getMonth() / 6) * 6 + 1, 1);
                break;
            case "Godina":
                dtDatum.setFullYear(myDate.getFullYear(), 0, 1);
                break;
        }

        //var dd = myDate.getDate();
        //var mm = myDate.getMonth() + 1;
        //var y = myDate.getFullYear();

        
        //var someFormattedDate = y + mm + dd;
        var someFormattedDate = dtDatum.toISOString();

        var i = someFormattedDate.indexOf("T");

        var dat = someFormattedDate.substring(0, i);
        var datret = dat.replace(/-/g, "");

        return datret;

    }



    function BrojDana(Iznos, oznaka) {
        
        var brdana = 0;

        switch (oznaka)
        {
            case "Dan":
                brdana = Iznos;
                break;
            case "Tjedan":
                brdana = Iznos * 7;
                break;
            case "Mjesec":
                brdana = Iznos * 30;
                break;
            case "Tromjesjeèje":
                brdana = Iznos * 90;
                break;
            case "Tromjesjecje":
                brdana = Iznos * 90;
                break;
            case "Polugodište":
                brdana = Iznos * 180;
                break;
            case "Polugodiste":
                brdana = Iznos * 180;
                break;
            case "Godina":
                brdana = Iznos * 360;
                break;
        }

        return brdana;
    }


    //KreirajGrafikon("20110101", "20140322", "Mjesec", 14, 25);

    function KreirajGrafikon(datod, datdo, mjesec, manpokgrafikonid, operateriid, naz, tip1) {

        var serije = [];
        var xosa = [];
        var serijepodaci = [];
        $("#grafikon").hide();
        $("#ajaxloaderzagraf").show();
        //var tst = "g=" + strGUID + "&d=" + strDataBase + "&action=kpi5&datumod=" + datod + "&datumdo=" + datdo + "&s=" + mjesec + "&id=" + manpokgrafikonid + "&id2=" + operateriid;
        $.ajax({
            url: strCrossDomainServiceURL,
            data: "g=" + strGUID + "&d=" + strDataBase + "&action=kpi5&datumod=" + datod + "&datumdo=" + datdo + "&s=" + mjesec + "&id=" + manpokgrafikonid + "&id2=" + operateriid,
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

                $.each(data, function (index, value) {
                    if ($.inArray(value.naziv, serije) == -1) {
                        serije.push(value.naziv);
                    }
                });

                $.each(data, function (index, value) {
                    if ($.inArray(value.gdatum, xosa) == -1) {
                        xosa.push(value.gdatum);
                    }
                });

                serije.slice;

                $.each(serije, function (s_index, s_value) {
                    var serijepodacivrijednosti = [];


                    //serijepodacivrijednosti = null;




                    $.each(xosa, function (x_index, x_value) {

                        $.each(data, function (index, value) {

                            if (value.naziv == s_value && value.gdatum == x_value) {

                                serijepodacivrijednosti.push(value.iznos);

                            };
                        });

                    });

                    o = new Object();
                    o.name = s_value;
                    o.data = serijepodacivrijednosti;

                    serijepodaci.push(o);

                });

                //GrafikonChart("Novčana sredstva");
                GrafikonChart(naz, xosa, serijepodaci, tip1);
                $("#ajaxloaderzagraf").hide();
                $("#grafikon").show();
                $(window).resize();
               
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloaderzagraf").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });

        
        glide.jump(3);

    };


    function GrafikonChart(naslov, xosa1, serijepodaci1, tip) {
        $("#sectionchart").show('slow');

        var tipgrafa = "spline";

        switch (tip) {
            case "0":
                tipgrafa = "column";
                break;
            case "1":
                tipgrafa = "column";
                break;
            case "11":
                tipgrafa = "spline";
                break;
            case "12":
                tipgrafa = "spline";
                break;
            case "15":
                tipgrafa = "spline";
                break;
        }


        // Build the chart

        $(function () {
            $('#grafikon').highcharts({
                chart: {
                    type: tipgrafa
                },
                title: {
                    text: naslov,
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    categories: xosa1,
                    labels: {
                        rotation: 90
                    }
                },
                yAxis: {
                    min: 0,
                    labels: {
                        format: '{value:,.0f}'
                    },
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                legend: {
                    borderWidth: 0
                },
                series: serijepodaci1
            });
        });



    }



    // ============================================================================= grafikon ...





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

        //var pod = [iznos];
        // Build the chart

        var Prosjek = parseFloat((IznosDobro + IznosLose) / 2);

        var MaxVrijednost = Prosjek + 2 * (IznosDobro - Prosjek);
        var MinVrijednost = Prosjek - 2 * (IznosDobro - Prosjek);

        if (iznos < MinVrijednost) {
            iznos = MinVrijednost;
        }

        if (iznos > MaxVrijednost) {
            iznos = MaxVrijednost;
        }

        var pod = [iznos];

        $(function () {
            $('#' + cont).highcharts({

                chart: {
                    type: 'gauge',
                    height: 130,
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
                    text: naz
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
                    data: pod,
                    name: naz
                }]

            });
        });




    }


    
     

});


