<!--#include file="JSON_2.0.4.asp"-->
<!--#include file="JSON_UTIL_0.1.1.asp"-->
<%

    response.CodePage=65001
    Response.ContentType = "text/html; charset=utf-8"
    Response.Expires = -1
    Response.CacheControl = "no-cache"
    Response.AddHeader "Pragma", "no-cache"

    Dim Conn
    dim jsoncallback
    dim s
    dim a
    dim d
    dim g
    dim id
    
    jsoncallback = request.QueryString("jsoncallback")  
    s = request.QueryString("s") ' neki serach string
    action = request.QueryString("action") ' action 
    g = request.QueryString("g") ' guid
    d = request.QueryString("d") ' baza
    
    id = request.QueryString("id")
       
    on error resume next
 
    Set Conn = Server.CreateObject("ADODB.Connection")
	conn.cursorlocation = 3
	
    ConnectionString = "DRIVER={SQL Server};SERVER=kkovac-lap;UID=sa;PWD=tan5;DATABASE=" & d & ";"
   ' ConnectionString = "DRIVER={SQL Server};SERVER=jupiter2012;Trusted_Connection=True;DATABASE=" & d & ";"
	conn.Open ConnectionString
  
    if err.number <> 0 then
        response.Write jsoncallback & "({ ""errnumber"" :  """ & err.number & """ , ""errdescription"" :  """ & replace(err.Description,"""","") & """ , ""userguid"" :  ""0""  });"
        response.End
    end if
    
    '================================================================== obrada action-a ... 

    if action = "test1" then test1
    if action = "login" then Login
    if action = "perzistitem" then perzistitem
    if action = "getorgshema" then getorgshema 
    if action = "getdocitems" then getdocitems 
    if action = "getskladista" then getskladista 
    if action = "getpartneri" then getpartneri 
    if action = "searchproducts" then searchproducts 
    if action = "searchpartners" then searchpartners 
    if action = "searchdocuments" then searchdocuments 
    if action = "checklogin" then checklogin 
    if action = "getmenuitems" then getmenuitems 
    if action = "searchizvgen" then searchizvgen 
    if action = "getizvgenreport" then getizvgenreport 
    
    
    '================================================================== the end ...
    CloseDBConnection
    '================================================================== data response subs ...

    sub searchdocuments
        on error resume next
        sql = "select top 200 g.MaloprodajaGlaId, g.DatumDok,g.BrojDok,g.Status,g.mpiznos,isnull(p.naziv,'') as partner, rtrim(isnull(o.ime,''))+' ' +rtrim(isnull(o.prezime,'')) as [osoba] from maloprodajagla g left join partneri p on g.PartneriId=p.PartneriId left join osobe o on g.osobaid=o.osobeid where g.brojdok like '%" & s & "%' order by 1 desc"
        
        'CROSSDOMAIN_SqlToJSON(sql)

        response.Write jsoncallback & "({ ""errnumber"":""0"",  ""errdescription"":"""" , ""items"":"
        QueryToJSON(Conn, sql).Flush 
        response.Write "});"

    end sub

    sub getdocitems
        on error resume next
        sql = "select  d.MPBlagajnaDetId,d.MPCijena,d.KolicinaIzlaz,r.naziv as Roba from MPBlagajnadet d inner join roba r on d.RobaId=r.RobaId where d.MPBlagajnaGlaID=3917"
        
        'CROSSDOMAIN_SqlToJSON(sql)

        response.Write jsoncallback & "({""errnumber"":""0"", ""errdescription"":"""" , ""items"":"
        QueryToJSON(Conn, sql).Flush 
        response.Write "});"

    end sub
        
    sub searchproducts
        on error resume next
        sql = "select top 20 robaid as id,naziv as title,jmnaziv as badge,klnaziv as subtitle from viroba where naziv + klnaziv like '" & s & "%'  order by naziv"
        CROSSDOMAIN_SqlToJSON(sql)
    end sub

    sub searchizvgen
        on error resume next
        sql = "select izvgenid,sifra,naziv,parametri from izvgen  where naziv <> '' and naziv like '%" & s & "%'  order by sifra,SortKey"
        CROSSDOMAIN_SqlToJSON(sql)
    end sub

     sub getizvgenreport
        on error resume next
        sql = "select top 1000 * from trgovina"
        CROSSDOMAIN_SqlToJSON(sql)
    end sub

    

    sub searchpartners
        on error resume next
        sql = "select top 20 PartneriId as id, ltrim(rtrim(Naziv)) as title, ltrim(rtrim(MjestaNaziv)) + ', ' + ltrim(rtrim(Adresa))  as subtitle, MatBroj as badge from viPartneri  where naziv + MjestaNaziv like '" & s & "%'  order by naziv"
        CROSSDOMAIN_SqlToJSON(sql)
    end sub

     sub getpartneri
        on error resume next
        sql = "select top 100 partneriid , naziv, matbroj, mjestanaziv  from viPartneri"
        CROSSDOMAIN_SqlToJSON(sql)
    end sub

    sub getorgshema  
        on error resume next
        controlid=request("controlid")
        sql = "select orgshemaid as id, ltrim(rtrim(naziv)) as title from orgshema order by sortkey"
        'CROSSDOMAIN_SqlToJSON(sql)
        response.Write jsoncallback & "(["
        QueryToJSON(Conn, "select '" & controlid & "' as controlid ").Flush 
        response.Write ","
        QueryToJSON(Conn, sql).Flush
        response.Write  "]);"
    end sub

    sub getskladista  
        on error resume next
        controlid=request("controlid")
        sql = "select skladisteid as id, ltrim(rtrim(oznaka)) + ' ' + ltrim(rtrim(opis)) as title from Skladiste order by Oznaka"
        'CROSSDOMAIN_SqlToJSON(sql)
        response.Write jsoncallback & "(["
        QueryToJSON(Conn, "select '" & controlid & "' as controlid ").Flush 
        response.Write ","
        QueryToJSON(Conn, sql).Flush
        response.Write  "]);"
    end sub
    

    sub test1
     on error resume next
        Dim member
        Set member = jsObject()
        member("name") = "Tuğrul"
        member("surname") = "Topuz"
        member("message") = "Hello World"
        'member.Flush

        Dim a(1,1)
        a(0,0) = "zero - zero"
        a(0,1) = "zero - one"
        a(1,0) = "one - zero"
        a(1,1) = "one - one"
        
        'Response.Write toJSON(a)
        
        CROSSDOMAIN_SqlToJSON("select * from products")
        
        exit sub
       
        response.Write jsoncallback & "(["
        QueryToJSON(Conn, "select 1 as ddd union select 2 ").Flush 
        response.Write ","
        QueryToJSON(Conn, "select 5 as bbb union select 6 ").Flush
        response.Write  "]);"

    end sub

    sub getmenuitems
     on error resume next
        if CheckGUID = 0 then AuthenticationFAILED
        sql = "select * from ssmeni where tag ='htm'"
        response.Write jsoncallback & "({""errnumber"":""0"", ""errdescription"":"""" , ""items"":"
        QueryToJSON(Conn, sql).Flush 
        response.Write "});"
        'CROSSDOMAIN_SqlToJSON(sql)
    end sub

    sub nekiupdateprimjer
        if CheckGUID = 0 then AuthenticationFAILED
        sql = "update ...."
        err.Clear
        conn.execute(sql)
        if err.number <> 0 then
            sql = "select  '" & err.number & "' as errnumber,'" & err.Description & "' as errdescription"
            else
            sql = "select  '0' as errnumber,'' as errdescription"
        end if
        CROSSDOMAIN_SqlToJSON(sql)
    end sub


    
    '================================================================== core ...

     Sub PerzistItem
        strApp = request("app")
        strKey = request("key")
        strValue = request("value")
        'OperateriID = CheckGUID()
        OperateriID = 7
        On Error Resume Next
            sql = "select count(*) from NetGenDBClipboard where operaterid=" & OperateriID & " and [key]='" & strApp & "/" & strKey & "'"
            trs = conn.execute(sql)
            If Not trs Is Nothing Then
                If trs(0) = 0 Then
                    sql = "inseRt into NetGenDBClipboard (operaterid,[key],[value]) values(" & OperateriID & ",'" & strApp & "/" & strKey & "','" & strValue & "')"
                    conn.execute(sql)
                Else
                    sql = "update NetGenDBClipboard set [value]='" & strValue & "' where operaterid=" & OperateriID & " and [key]='" & strApp & "/" & strKey & "'"
                    conn.execute(sql)
                End If
            End If
    End Sub
    
    sub AuthenticationFAILED
            CloseDBConnection
            response.Write jsoncallback & "({ ""errnumber"" :  ""-2"" , ""errdescription"" :  ""Authentication FAILED. Your session has expired.  "" , ""userguid"" :  ""0""  });"
            response.End
    end sub
        
    sub CloseDBConnection 
	    on error resume next
	    set rs = nothing
	    conn.close
	    set conn = nothing
    end sub

    sub checklogin
        sql = "select * from ssoperateri where guid='" & g & "'"
	    set trs=Conn.Execute(sql)
        if not trs.eof then 
            response.Write jsoncallback & "({ ""userguid"" :  """ & trs("guid") & """ , ""username"" :  """ & trim(trs("naziv")) & """ , ""database"" : """ &  d & """ , ""inicijali"" :  """ & trim(trs("inicijali")) & """  });"
        else
            response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""login expired "" , ""userguid"" :  ""0"" });"
        end if
    end sub

    sub Login
        on error resume next
        ' alter table ssoperateri add guid [uniqueidentifier] not NULL default(newid())
        if d="" then
            response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""database field is required ! "" , ""userguid"" :  ""0""  });"
            exit sub
        end if

        sql = "select * from ssoperateri where naziv='" & request.QueryString("e") & "' and password='" & request.QueryString("p") & "'"
	    set trs=Conn.Execute(sql)

        if not trs.eof then 
            sql = "update ssoperateri set guid=newid() where operateriid=" & trs("operateriid")
            'Conn.Execute(sql) 'privremeno ostavljam guid-e jer svi radimo sa "spin" userom
            sql = "select guid from ssoperateri where operateriid=" & trs("operateriid")
	        set trs2=Conn.Execute(sql)
            response.Write jsoncallback & "({ ""userguid"" :  """ & trs2("guid") & """ , ""username"" :  """ & trim(trs("naziv")) & """ , ""database"" : """ &  d & """ , ""inicijali"" :  """ & trim(trs("inicijali")) & """  });"
        else
            response.Write jsoncallback & "({ ""errnumber"" :  ""-1"" , ""errdescription"" :  ""check username and password ! "" , ""userguid"" :  ""0"" });"
        end if
    end sub

    function CheckGUID
        sql = "select operateriid from ssoperateri where guid='" & g & "'"
        set trs=Conn.Execute(sql)
        if not trs.eof then 
            CheckGUID=trs("operateriid")
        else
            CheckGUID=0
        end if
    end function

    sub CROSSDOMAIN_SqlToJSON(sql)
        err.Clear
        response.Write jsoncallback & "("
        QueryToJSON(Conn, sql).Flush
        response.Write  ");"
        if err.number <> 0 then
            response.Write jsoncallback & "({ ""errnumber"" :  " & err.number & " , ""errdescription"" :  """ & replace(err.Description,"""","") & """  });"
            conn.close
            Set Conn = nothing
            response.End
        end if
    end sub

%>