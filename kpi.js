$(document).ready(function () {
    // ================================================================================== history ...
    // kk 20.02.2014.
    // ================================================================================== login ...
    var strCrossDomainServiceURL = '';
    var strGUID = '';
    var strDataBase = '';

    //if (typeof localStorage.JRWDGUID == 'undefined' || localStorage.JRWDGUID == 'undefined' || localStorage.JRWDGUID == '0' || localStorage.JRWDGUID == '') {
    //    TurnONlogin();
    //}
    //else {
    //    strGUID = localStorage.JRWDGUID;
    //    strCrossDomainServiceURL = localStorage.JRWDw;
    //    strDataBase = localStorage.JRWDd;
    //    TurnOFFlogin();
    //};

    TurnOFFlogin();

    function TurnONlogin() { $("#sectionlogin").show(); $(".off-canvas-wrap").addClass('hide'); $(".logoutrwd").addClass('hide'); strGUID = ""; localStorage.JRWDGUID = '0'; $("#p").val(''); $("#loginserverresponse").html(''); $(".printbutton,.filterbutton,.aboutrwd").hide(); }
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
        if (strCrossDomainServiceURL == '') { $("#loginserverresponse").html("<br/><div class='alert-box secondary'><i class='fi-alert size-28'></i><h6>web service is required field</h6></div>"); return; }
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

    $(".logoutrwd").on('click', function () { TurnONlogin(); });
    $("#buttonsettings").on('click', function () { $("#settingsfields").toggle(); });
    

    // =============================================================================== generalije ...

    $('form').submit(function (e) { e.preventDefault(); return false; });

    $(".printdoc").on('click', function () { $(".exit-off-canvas").click(); window.print(); return false; });

    $(".name,.title").on('click', function () { // dodajem mogućnost otvaranja offkanvasa i na app title i offkanvas title
        $(".left-off-canvas-toggle").click();
    });

    $(".theme").on('click', function () {
        localStorage.JRWDbackstretch = $(this).attr('data-id');
        if ($(this).attr('data-id') == "0") { $.backstretch('destroy', false); } else { $.backstretch([$(this).attr('data-id')]); $(".backstretch").addClass('hide-for-print'); }
    });

    $.backstretch([localStorage.JRWDbackstretch]);

    $(".backstretch").addClass('hide-for-print');
        
    $(".aboutrwd").on('click', function () {
        $(".mojsection").hide();
        $(".exit-off-canvas").click();
        $("#sectionaboutrwd").show('slow');
    });

   

    // ============================================================================= GET JSON DATA & format HTML ...

    $('#filterform').submit(function (e) { GetList($("#search").val()); $(".left-off-canvas-toggle").click(); });


    var kpistora = [{ "manpokazateljiid": 1, "Naziv": "Novčana sredstva", "grafvrijednost": 80000, "vr1": 550,  "vr2": 800, "vr3": 1500, "vr4": 5000 },
                    { "manpokazateljiid": 20, "Naziv": "Priliv novčanih sredstava", "grafvrijednost": 150000, "vr1": 2000, "vr2": 2500, "vr3": 1500, "vr4": 7000 },
                    { "manpokazateljiid": 55, "Naziv": "Ukupno fakturirani RUC", "grafvrijednost": 450000, "vr1": 70000, "vr2": 45000, "vr3": 5000, "vr4": 10000 }];

    //GetList('');

    function GetList(search) {

        var strFormattedTABLE = "";

        $.each(kpistora, function (index, value) {
        strFormattedTABLE = strFormattedTABLE + '<div class="medium-4 columns"><div class="panel">' +
                                                '<h5>' + value.Naziv + '</h5>' +
                                                '<h3>YTD: ' + value.vr1 + '</h3>' +
                                                '<div id="bsjChartContainer' + value.manpokazateljiid + '"  ></div>' +
                                                '<span >MTD</span>' +
                                                '<span class="right" >' + value.vr2 + '</span><br/>' +
                                                '<span >YTD avg</span>' +
                                                '<span class="right">' + value.vr3 + '</span><br/>' +
                                                '<span >YTD avg</span>' +
                                                '<span class="right">' + value.vr4 + '</span>' +
                                                '</div></div>';
        });

        $("#lista").html(strFormattedTABLE);

        $.each(kpistora, function (index, value) {
            PieChart(value.grafvrijednost, 'bsjChartContainer' + value.manpokazateljiid);
        });
    }

    function PieChart(iznos, cont, naz) {
        //$("#sectionchart").show('slow');

        var pod = [iznos];
        // Build the chart

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
                    min: -116052,
                    max: 750252,
                    tickPosition: 'inside',
                    lineWidth: 2,
                    labels: {
                        enabled: false
                    },
                    plotBands: [{
                        from: -116052,
                        to: 100524,
                        color: 'green',
                        innerRadius: null,
                        outerRadius: null
                    }, {
                        from: 100524,
                        to: 533676,
                        color: 'yellow',
                        innerRadius: null,
                        outerRadius: null
                    }, {
                        from: 533676,
                        to: 750252,
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

    function GetList1(search) {
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
                            strFormattedTABLE = strFormattedTABLE + '<table style="width:100%;" id="table' + trgovinaId + '" class="table hide"><thead><tr><th>Roba</th><th>Količina</th><th>Neto</th><th>RUC</th></tr></thead><tbody>' + strFormattedROWS + '</tbody></table>';
                            strFormattedROWS = '';
                            k = 0;
                            arrDataForPieChart.push([trgovinanaziv, parseFloat(ukupnovrijednost.toFixed(2))]);
                            ukupnovrijednost = 0;
                        }
                        strFormattedTABLE = strFormattedTABLE + '<div data-alert class="alert-box secondary"><div  class="tablecaption" data-id="' + item.trgovinaId + '" ><i class="fi-shopping-cart size-28"></i> <strong> ' + item.trgovina + '</strong></div><a href="#" data-id="' + item.trgovinaId + '" class="close hide-for-print">&times;</a></div>';
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
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#ajaxloader1").hide();
                $("#lista").html("<br/><div class='panel'><i class='fi-unlink size-36'></i><h4>" + thrownError + ' ' + xhr.status) + '</h4></div>';
            }
        });
    }


    // ============================================================================= chart ...


    // ============================================================================= podacistora ...

    var podacistora = [{ "gdatum": "m:01", "godina": "2009", "manpokazateljiid": 31, "iznos": 720738.4765, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:01", "godina": "2010", "manpokazateljiid": 31, "iznos": 601492.4228, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:01", "godina": "2011", "manpokazateljiid": 31, "iznos": 720509.9071, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:01", "godina": "2012", "manpokazateljiid": 31, "iznos": 795732.9556, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:01", "godina": "2013", "manpokazateljiid": 31, "iznos": 126814, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:01", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2009", "manpokazateljiid": 31, "iznos": 791342.1096, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2010", "manpokazateljiid": 31, "iznos": 785902.9724, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2011", "manpokazateljiid": 31, "iznos": 1006528.5523, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2012", "manpokazateljiid": 31, "iznos": 1423022.7816, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:02", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2009", "manpokazateljiid": 31, "iznos": 768370.6896, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2010", "manpokazateljiid": 31, "iznos": 564093.9318, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2011", "manpokazateljiid": 31, "iznos": 1143394.7925, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2012", "manpokazateljiid": 31, "iznos": 860223.9026, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:03", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2009", "manpokazateljiid": 31, "iznos": 574348.2907, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2010", "manpokazateljiid": 31, "iznos": 720857.973, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2011", "manpokazateljiid": 31, "iznos": 1147144.3636, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2012", "manpokazateljiid": 31, "iznos": 807814.1818, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:04", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2009", "manpokazateljiid": 31, "iznos": 1034783.0261, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2010", "manpokazateljiid": 31, "iznos": 648056.1392, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2011", "manpokazateljiid": 31, "iznos": 1435392.4974, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2012", "manpokazateljiid": 31, "iznos": 1040997.945, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:05", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2009", "manpokazateljiid": 31, "iznos": 541430.8938, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2010", "manpokazateljiid": 31, "iznos": 994274.4538, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2011", "manpokazateljiid": 31, "iznos": 1616796.6241, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2012", "manpokazateljiid": 31, "iznos": 1575562.3963, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:06", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2009", "manpokazateljiid": 31, "iznos": 1493807.8404, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2010", "manpokazateljiid": 31, "iznos": 612023.6149, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2011", "manpokazateljiid": 31, "iznos": 800780.2544, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2012", "manpokazateljiid": 31, "iznos": 1023844.0182, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:07", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2009", "manpokazateljiid": 31, "iznos": 832758.7395, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2010", "manpokazateljiid": 31, "iznos": 598140.2336, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2011", "manpokazateljiid": 31, "iznos": 958626.2081, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2012", "manpokazateljiid": 31, "iznos": 923244.7254, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:08", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2009", "manpokazateljiid": 31, "iznos": 827182.5445, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2010", "manpokazateljiid": 31, "iznos": 605228.0846, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2011", "manpokazateljiid": 31, "iznos": 1530446.0017, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2012", "manpokazateljiid": 31, "iznos": 899242.4153, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:09", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2009", "manpokazateljiid": 31, "iznos": 951401.8119, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2010", "manpokazateljiid": 31, "iznos": 660713.7154, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2011", "manpokazateljiid": 31, "iznos": 1219362.4325, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2012", "manpokazateljiid": 31, "iznos": 810439.5708, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:10", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2009", "manpokazateljiid": 31, "iznos": 716984.7054, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2010", "manpokazateljiid": 31, "iznos": 1436234.3523, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2011", "manpokazateljiid": 31, "iznos": 1815905.8752, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2012", "manpokazateljiid": 31, "iznos": 1194107.3154, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:11", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2009", "manpokazateljiid": 31, "iznos": 1489434.9836, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2010", "manpokazateljiid": 31, "iznos": 2624233.8466, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2011", "manpokazateljiid": 31, "iznos": 2170037.9327, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2012", "manpokazateljiid": 31, "iznos": 1269916.0045, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2013", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }, { "gdatum": "m:12", "godina": "2014", "manpokazateljiid": 31, "iznos": 0, "Pokazatelj": "Ukupna fakturirana realizacija" }];

    //var podacistora = {
    //    "aaData": [{
    //        "data": [{
    //            "x": 1299888000000,
    //            "y": 3
    //        },
    //                {
    //                    "x": 1299891600000,
    //                    "y": 13
    //                },
    //                {
    //                    "x": 1299895200000,
    //                    "y": 4
    //                }
    //        ],
    //        "name": "users"
    //    },
    //      {
    //          "data": [{
    //              "x": 1299888000000,
    //              "y": 4
    //          },
    //              {
    //                  "x": 1299891600000,
    //                  "y": 33
    //              },
    //              {
    //                  "x": 1299895200000,
    //                  "y": 5
    //              }
    //          ],
    //          "name": "messages"
    //      }
    //    ]
    //};


    // ============================================================================= podacistora ...

    var serije = [];
    var xosa = [];
    var serijepodaci = [];
    

    //var catalog = {
    //    products: [
    //        { category: 'fos', name: 'retek' },
    //        { category: 'fos', name: 'item' },
    //        { category: 'nyedva', name: 'blabla' },
    //        { category: 'fos', name: 'gihi' },
    //    ]
    //};
    //var categories = [];

    $(".chart").on('click', function () {
        $(".mojsection").hide();
        $("#sectionchart").show('slow');
        $(".left-off-canvas-toggle").click();

        //$.each(catalog.products, function (index, value) {
        //    if ($.inArray(value.category, categories) == -1) {
        //        categories.push(value.category);
        //    }
        //});

        //console.log(categories);

        $.each(podacistora, function (index, value) {
            if ($.inArray(value.godina, serije) == -1) {
                serije.push(value.godina);
            }
        });

        $.each(podacistora, function (index, value) {
            if ($.inArray(value.gdatum, xosa) == -1) {
                xosa.push(value.gdatum);
            }
        });

        $.each(serije, function (s_index, s_value) {
            var serijepodacivrijednosti = [];
           
            
            //serijepodacivrijednosti = null;



            
            $.each(xosa, function (x_index, x_value) {

                $.each(podacistora, function (index, value) {

                    if (value.godina == s_value && value.gdatum == x_value) {

                        serijepodacivrijednosti.push(value.iznos);

                    };
                });

            });

            o = new Object();
            o.name = s_value;
            o.data = serijepodacivrijednosti;

            serijepodaci.push(o);

        });

        //$.each(podacistora, function (index, value) {
        //    if ($.inArray(value.godina, serije) == -1) {
        //        serije.push(value.godina);
        //    }
        //});

        console.log(serije);




        PieChart();
        //StackedColumn();
    });



    var arrDataForPieChart = [];

    


    
     

});


