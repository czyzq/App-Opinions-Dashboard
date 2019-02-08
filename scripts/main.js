/**Wypisuje średnią z ostatnich X ocen, liczbe poszczególnych ocen i 'najgorzej działające' urządzenie*/
function meanRatingThisWeek() {
    let suma = 0;
    let o1 = 0, o2 = 0, o3 = 0, o4 = 0, o5 = 0;
    let liczbaOcen = 0;

    class Device {
        constructor(name, encounters) {
            this.name = name;
            this.encounters = encounters;
        }
    }

    let devicesArray = [];
    devicesArray.push(new Device("test", 0));
    let max = 0;
    let worst = "test";
    let lastBad = 0;
    let lastGood = 0;
    let lastBadText = '';
    let lastGoodText = '';
    for (let index in bigArray) {
        suma += bigArray[index].comments[0].userComment.starRating;
        liczbaOcen += 1;

        if (bigArray[index].comments[0].userComment.starRating === 1) {
            if (bigArray[index].comments[0].userComment.lastModified.seconds > lastBad) {
                lastBad = bigArray[index].comments[0].userComment.lastModified.seconds;
                lastBadText = bigArray[index].comments[0].userComment.text;
            }
            var productN = bigArray[index].comments[0].userComment.deviceMetadata.productName;
            o1 += 1;
            for (var device = 0; device < devicesArray.length; device++) {
                let nameD = devicesArray[device].name;
                if (productN != nameD) {
                    devicesArray.push(new Device(productN, 1));
                }
                else {
                    devicesArray[device].encounters = devicesArray[device].encounters + 1;
                }
            }
            for (var device = 0; device < devicesArray.length; device++) {
                if (devicesArray[device].encounters > max) {
                    max = devicesArray[device].encounters;
                    worst = devicesArray[device].name;
                }
            }
        }
        if (bigArray[index].comments[0].userComment.starRating === 2) {
            o2 += 1;
        }
        if (bigArray[index].comments[0].userComment.starRating === 3) {
            o3 += 1;
        }
        if (bigArray[index].comments[0].userComment.starRating === 4) {
            o4 += 1;
        }
        if (bigArray[index].comments[0].userComment.starRating === 5) {
            if (bigArray[index].comments[0].userComment.lastModified.seconds > lastGood) {
                lastGood = bigArray[index].comments[0].userComment.lastModified.seconds;
                lastGoodText = bigArray[index].comments[0].userComment.text;
            }
            o5 += 1;
        }
    }

    let all = o1 + o2 + o3 + o4 + o5;

    $('div.row').empty();
    $('div.row').append(chart(1, o1, all), chart(2, o2, all), chart(3, o3, all), chart(4, o4, all), chart(5, o5, all));

    let srednia = (suma / liczbaOcen).toFixed(2);
    $('div.week').empty();
    $('p.weekly').empty();
    $('p.worst').empty();
    $('div.lastReviews').empty();
    $('div.lastReviews').append('<h4 style="text-align: left">Ostatnie opinie</h4><hr>');
    $('p.lastBad').empty();
    $('p.lastGood').empty();
    $('div.week').append('<h4 style="text-align: left">Oceny w tym tygodniu</h4><hr>');
    $('p.weekly').append('Średnia ocen : <b>' + srednia + '</b>' + stars(srednia) + ' (<b>' + liczbaOcen + '</b> ocen)');
    $('p.worst').append('Najwiecej złych ocen w tym tygodniu (' + '<b>' + max + '</b>' + ') z urządenia: ' + '<b>' + worst + '</b>');
    $('p.lastBad').append('Użytkownicy narzekają na: <br /><b>"' + lastBadText + '"</b>');
    $('p.lastGood').append('Użytkownicy chwalą: <br /><b>"' + lastGoodText + '"</b>');
}

/**Wypisuje średnią i liczbę złych/dobrych opinii (1 i 5 *) */
function meanRatingToday() {
    let suma = 0, sumaWczoraj = 0;
    let liczbaOcen = 0, liczbaOcenWczoraj = 0;
    let liczbaZlych = 0;
    let liczbaDobrych = 0;
    for (let index in bigArray) {
        if (isIt('today', bigArray[index].comments[0].userComment.lastModified.seconds)) {
            if (bigArray[index].comments[0].userComment.starRating == 1) liczbaZlych += 1;
            if (bigArray[index].comments[0].userComment.starRating == 5) liczbaDobrych += 1;
            suma += bigArray[index].comments[0].userComment.starRating;
            liczbaOcen += 1;
        }
        if (isIt('yesterday', bigArray[index].comments[0].userComment.lastModified.seconds)) {
            sumaWczoraj += bigArray[index].comments[0].userComment.starRating;
            liczbaOcenWczoraj += 1;
        }
    }
    badReviews(liczbaZlych);
    let srednia = (suma / liczbaOcen).toFixed(2);
    let sredniaWczoraj = (sumaWczoraj / liczbaOcenWczoraj).toFixed(2);
    let growth = ((srednia * 100) / (sredniaWczoraj * 100)) * 100 - 100;
    growth = growth.toFixed(1);
    $('p.daily').empty();
    $('p.bad').empty();
    $('p.good').empty();
    $('div.today').empty();
    $('div.today').append('<h4 style="text-align: left">Oceny dziś</h4><hr>')
    if (srednia >= sredniaWczoraj) {
        $('p.daily').append('Średnia ocen: ' + '<b>' + srednia + '</b>' + stars(srednia) + ' (+<b>' + growth + '%</b> od wczoraj)');
    }
    else {
        $('p.daily').append('Średnia ocen: ' + '<b>' + srednia + '</b>' + stars(srednia) + ' (<b>' + growth + '%</b> od wczoraj)');
    }
    $('p.bad').append('Liczba złych opinii dziś: <b>' + liczbaZlych + '</b>');
    $('p.good').append('Liczba dobrych opinii dziś: <b>' + liczbaDobrych + '</b>');

}

/**Sprawdza czy data podana w POSIX time jest datą dzisiejszą lub wczorajszą*/
function isIt(day, seconds) {
    let myDate = new Date(seconds * 1000);
    myDate = myDate.toLocaleDateString();
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let dd, mm, yyyy;
    if (day === 'today') {
        dd = today.getDate();
        mm = today.getMonth() + 1;
        yyyy = today.getFullYear();
    }
    if (day === 'yesterday') {
        dd = yesterday.getDate();
        mm = yesterday.getMonth() + 1;
        yyyy = yesterday.getFullYear();
    }
    if (mm < 10) mm = '0' + mm;
    let theDay = dd + '.' + mm + '.' + yyyy;

    return myDate == theDay;
}

/**Wyświetla alarm jeśli liczb złych ocen przekroczy Y*/
function badReviews(counted) {
    let htmlText = '<p><b>Liczba opini z jedną gwiazdką przekroczyła ' + Y + '</b></p><p style="text-align: left"><b>Liczba złych opinii: ' + counted + '</b></p>';
    if (counted >= Y) {
        $('div.alert').css('visibility', 'visible');
        //alert("Liczba opini z jedną gwiadką przekroczyła "+Y);
        $('p.alerted').empty();
        $('p.alerted').append(htmlText);
    }
    else
        $('div.alert').css('visibility', 'hidden');
}

/**Zwraca odpowiednio wypełnione 5 gwiazdek w zależności od rating*/
function stars(rating) {
    result = " "
    for (var i = 0; i < 5; i++)
        if (i < rating - 0.499)
            result += '<span class="fa fa-star checked"></span>';
        else
            result += '<span class="fa fa-star"></span>';
    return result;
}

/**Rysuje wypełnione w odpowiednim stopniu belki oznaczajace liczbe opnii z daną oceną*/
function chart(rate, rateAmount, all) {
    let percentOfRate = (rateAmount / all) * 100;
    let htmlTxt = '';
    htmlTxt +=
        '<div class="side">' +
        '<div>' + rate + ' <span class="fa fa-star checked"></span></div>' +
        '</div>' +
        '<div class="middle">' +
        '<div class="barContainer">' +
        '<div class="bar-4" style="width:' + percentOfRate + '%"></div> ' +
        '</div>' +
        '</div> ' +
        '<div class="side right">' +
        '<div>' + rateAmount + '</div>' +
        '</div> ';

    return htmlTxt;
}

/**Zwraca tylko imię/pierwszy człon nicku z Google Play #RODO*/
function cenzor(name) {
    if (name) {
        let strings = name.split(" ")
        return strings[0];
    }
    else
        return " ";
}

/**Zwraca pojedyncza opinie w formie stringa HTML wrzuconego do karty*/
function reviewsToHTML(opinia) {

    var data = new Date(1000 * (opinia.comments[0].userComment.lastModified.seconds));
    var data = data.toString().substring(0, 25);
    //var comments = opinie[index].comments;ddd
    // var commentU = comments[0].userComment;
    var comments = opinia.comments;
    var commentU = comments[0].userComment;
    let htmlText = '' + '<div class="card">';
    if (commentU.starRating == 1) {
        htmlText += '<h5 class="red" ><strong>' + cenzor(opinia.authorName) + '</strong>' +
            '&nbsp &nbsp' + data + '&nbsp &nbsp &nbsp &nbsp' +
            commentU.thumbsUpCount + ' <i class="fa fa-thumbs-up"></i>' + '&nbsp &nbsp' +
            commentU.thumbsDownCount + ' <i class="fa fa-thumbs-down"></i>' +
            '</h5>';

    } else if (commentU.starRating == 2 || commentU.starRating == 3) {
        htmlText += '<h5 class="yellow"><strong>' + cenzor(opinia.authorName) + '</strong>' +
            '&nbsp &nbsp' + data + '&nbsp &nbsp &nbsp &nbsp' +
            commentU.thumbsUpCount + ' <i class="fa fa-thumbs-up"></i>' + '&nbsp &nbsp' +
            commentU.thumbsDownCount + ' <i class="fa fa-thumbs-down"></i>' +
            '</h5>';
    } else {
        htmlText += '<h5><strong>' + cenzor(opinia.authorName) + '</strong>' +
            '&nbsp &nbsp' + data + '&nbsp &nbsp &nbsp &nbsp' +
            commentU.thumbsUpCount + ' <i class="fa fa-thumbs-up"></i>' + '&nbsp &nbsp' +
            commentU.thumbsDownCount + ' <i class="fa fa-thumbs-down"></i>' +
            '</h5>';
    }
    htmlText += '<div class="opinion">';
    htmlText += '<div class="opinionText" style="overflow:-moz-scrollbars-none;overflow-scrolling: auto;overflow:hidden">' +
        '<p>' + stars(commentU.starRating) + commentU.text + '</p>';
    /**
     if (comments.length > 1) {
        htmlText += '<p style="text-align: right"><i class="fa fa-check" aria-hidden="true"></i></p>';
    }*/
    htmlText += '</div>'
    // komentarz developera -zbędny w dashboardzie(?)

    if (comments.length > 1) {
        var data1 = new Date(1000 * (opinia.comments[1].developerComment.lastModified.seconds));
        var data1 = data1.toString().substring(0, 25);
        var commentDev = comments[1].developerComment;
        htmlText += '<div class="devText"><p style="color: black; font-size: 0.85rem; padding: 0.4rem 0.5rem 0.4rem;"><b> ' + data1 + '</b><br />' + commentDev.text + '</p></div>';
    }
    htmlText += '</div>';
    if (commentU.starRating == 1) {
        htmlText += '<section class="sectionRed">';

    } else if (commentU.starRating == 2 || commentU.starRating == 3) {
        htmlText += '<section class="sectionYellow">';
    } else {
        htmlText += '<section class="section">';
    }
    if (typeof (commentU.deviceMetadata) != "undefined") {
        htmlText += '<dl class="inline">' +
            '<dt>Apk v.: </dt>' +
            '<dd>' + cutter(commentU.appVersionName) + ' (' + cutter(commentU.appVersionCode) + ')</dd>' +
            '<dt>Nazwa: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.productName) + '</dd>' +
            /*
            if(commentU.deviceMetadata.productName)
                htmlText += commentU.deviceMetadata.productName.substring(0,30) ;
            else
                htmlText +='<dd>' + commentU.deviceMetadata.productName.substring(0,30) + '</dd>';
                */
            '<dt>Producent: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.manufacturer) + '</dd>' +
            '<dt>Typ: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.deviceClass) + '</dd>' +
            '<dt>Procesor: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.cpuMake) + ' ' + cutter(commentU.deviceMetadata.cpuModel) + '</dd>' +
            '</dl>' +
            '<dl class="inline">' +
            '<dt>Platforma: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.nativePlatform) + '</dd>' +
            '<dt>RAM: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.ramMb) + '</dd>' +
            '<dt>Android v.: </dt>' +
            '<dd>' + system(commentU.androidOsVersion).toFixed(1) + '</dd>' +
            '<dt>Ekran: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.screenWidthPx) + ' x ' + cutter(commentU.deviceMetadata.screenHeightPx) +
            ' (' + cutter(commentU.deviceMetadata.screenDensityDpi) + ' DPI)</dd>' +
            '<dt>OpenGL v.: </dt>' +
            '<dd>' + cutter(commentU.deviceMetadata.glEsVersion) + '</dd>' +
            '</dl>';
    }
    else {
        htmlText += '<dl class="inline">' +
            '<dt>Apk v.: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>Nazwa: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>Producent: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>Typ: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>Procesor: </dt>' +
            '<dd>N/A</dd>' +
            '</dl>' +
            '<dl class="inline">' +
            '<dt>Platforma: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>RAM: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>Android v.: </dt>' +
            //'<dd>' + commentU.androidOsVersion +'</dd>' +
            '<dd>N/A</dd>' +
            '<dt>Ekran: </dt>' +
            '<dd>N/A</dd>' +
            '<dt>OpenGL ES v.: </dt>' +
            '<dd>N/A</dd>' +
            '</dl>';
    }
    htmlText += '</section>';

    htmlText += '</div>';
    return htmlText;

}

/**Skraca jeśli parametr zbyt długi*/
function cutter(string) {
    if (typeof (string) != "undefined") {
        if (string.length > 30) return string.substring(0, 28) + '...';
        else return string;
    }
    else
        return 'N/A';
}

/**Zwraca wersje systemu odpowidają numerowi*/
function system(number) {
    if (typeof (number) == "undefined") return 0;
    if (number === 27) return 8.1;
    if (number === 25) return 7.1;
    if (number === 26) return 8.0;
    if (number === 24) return 7.0;
    if (number === 23) return 6.0;
    if (number === 22) return 5.1;
    if (number === 21) return 5.0;
    if (number === 20) return 5.0;//"unidentified";
    if (number === 19) return 4.4;
    if (number === 18) return 4.3;
    if (number === 17) return 4.2;
    if (number === 16) return 4.1;
    if (number === 15) return 4.0;
    if (number <= 14) return 4.0;//"under 4.0";
}

/**Wyciągnięcie oceny aplikacji ze strony Google Play*/
function webScrape() {
    $.getJSON('http://anyorigin.com/go?url=https%3A//play.google.com/store/apps/details%3Fid%3D**package_here**&callback=?', function (data) {
        let rate = $(data.contents).find('div.BHMmbe').text();
        let allOpinions = $(data.contents).find('span.EymY4b').text();
        let allOpinionss = allOpinions.split(' ');

        $('div.testo').empty();
        $('div.testo').append('<h4 style="text-align: left">Ocena aplikacji: </h4>' + '<hr>');
        $('div.testo').append('<h2 style="text-align: left">' + rate + stars(rate) + '</h2> ');
        $('div.testo').append('<br />Wszystkich ocen: ' + allOpinionss[0]);
    });

}

/**TODO: Test wyświetlania na tv kart przy uzyciu jquery*/
function testTV() {
    let htmlText = '' + '<div class="card">' +
        '<div class="opinion">';
    htmlText += '<h5 class="author"><strong>imie nazwisko</strong>' + "&nbsp &nbsp" + 'data komentarza</h5>';
    htmlText += '<div class="opinionText"><marquee direction="down">' +
        '<p>' + stars(4) + 'Tu tekst opini zacwalającj aplikację </p></marquee></div>';
    /* komentarz developera -zbędny w dashboardzie(?)
    if(comments.length>1){
        var data1=new Date(1000*(opinie[index].comments[1].developerComment.lastModified.seconds));
        var data1=data1.toString().substring(0,25);
        var commentDev = comments[1].developerComment;
        htmlText += '<div class="devText"><p style="color: black; font-size: 0.65rem; padding: 0.3rem 0.4rem 0.3rem;"><b>'+ data1 +'</b><br />' + commentDev.text + '</p></div>';
    }*/
    htmlText += '</div>';
    htmlText += '<section>';
    htmlText += '<dl class="inline">' +
        '<dt>Apk v.: </dt>' +
        '<dd> wersja apki</dd>' +
        '<dt>Nazwa: </dt>' +
        '<dd>Nazwa Telefonu</dd>' +
        '<dt>Producent: </dt>' +
        '<dd>Producent</dd>' +
        '<dt>Typ: </dt>' +
        '<dd>telefon/tablet</dd>' +
        '<dt>Procesor: </dt>' +
        '<dd>Jakiś model proc.</dd>' +
        '</dl>' +
        '<dl class="inline">' +
        '<dt>Platforma: </dt>' +
        '<dd>platforma natywna</dd>' +
        '<dt>RAM: </dt>' +
        '<dd>ile MB RAM</dd>' +
        '<dt>Android v.: </dt>' +
        //'<dd>' + commentU.androidOsVersion +'</dd>' +
        '<dd>' + system(26).toFixed(1) + '</dd>' +
        '<dt>Ekran: </dt>' +
        '<dd>1080x1920' +
        ' (320)</dd>' +
        '<dt>OpenGL ES v.: </dt>' +
        '<dd>werjsa GLa</dd>' +
        '</dl></section>';

    htmlText += '</div>';
}

/**Główna funkcja wypisująca opinie w postaci kart*/
function ReviewList(reviewsAmount) {
    gapi.client.androidpublisher.reviews.list({
        'packageName': PACKAGE,
        'maxResults': reviewsAmount,
        //'startIndex':1
    }).then(function (response) {
        let opinie = response.result.reviews;
        let reviewsArrayCopy;
        //bigArray=opinie.concat(bigArray);
        $('p.tester').append('<br />opinie: >>' + opinie.length + '<<' +
            '<br /> duza tablica: >>' + bigArray.length + '<<');

        if (reviewsArray.length < 1) {
            for (var index in opinie) {
                bigArray.push(opinie[index]);
                let review = reviewsToHTML(opinie[index]);
                reviewsArray.push(review);
                revTimeArray.push(opinie[index].comments[0].userComment.lastModified.seconds);
                ratingsArray.push(opinie[index].comments[0].userComment.starRating);
            }
        }
        else {

            let temp = [], tempRevTimeArray = [], littleArray = [];
            //for (let index = 0; index < reviewsAmount; index++) {
            for (let index in opinie) {
                let time = opinie[index].comments[0].userComment.lastModified.seconds;
                if (time > revTimeArray[0]) {
                    littleArray.push(opinie[index]);
                    let review = reviewsToHTML(opinie[index]);
                    temp.push(review);
                    tempRevTimeArray.push(time);
                    ratingsArray.push(opinie[index].comments[0].userComment.starRating);
                }
            }
            if (littleArray[0]) bigArray = littleArray.concat(bigArray);
            if (temp[0]) reviewsArray = temp.concat(reviewsArray);
            if (tempRevTimeArray[0]) revTimeArray = tempRevTimeArray.concat(revTimeArray);
        }
        reviewsArrayCopy = reviewsArray.slice();
        let reviewsArrayX = reviewsArrayCopy.slice(0, X);
        let page = [];
        page.splice(0, 1);
        let pagesNumber = (reviewsArrayX.length / DISPLAYED) + 1;
        for (let k = 0; k < pagesNumber; k++) {
            if (!reviewsArrayX[0]) break;
            page[k] = '';
            for (let i = 0; i < DISPLAYED; i++) {
                if (!reviewsArrayX[0]) break;
                page[k] += reviewsArrayX.shift();
            }
        }

        display(page);
        webScrape();
        $('#stats').css('visibility', 'visible');
        $('h2.reviewsTitle').css('visibility', 'visible');
        //meanRating();
        meanRatingToday(response);
        meanRatingThisWeek();
    })
}

/**Wyświetla co INTERVAL ms nową stronę opinii w pętli*/
function display(page) {
    let i = 0;
    var displaying = function () {
        //print(i);
        let Xo = 0;
        if (bigArray.length < X)
            Xo = bigArray.length;
        else
            Xo = X;

        $('div.opinions').empty();
        $('div.opinions').append(page[i]).show('slow');
        $('h2.reviewsTitle').empty();
        $('h2.reviewsTitle').append('Opinie ' + (i + 1) + '/' + page.length + ' (ostatnie ' + Xo + ')');
        i = (i + 1) % page.length;
        counter = setTimeout(displaying, INTERVAL)
    };
    displaying();
}

/**---- Poniżej obsluga autoryzacji i API----*/

/**Inicjalizuje klienta i uruchamia całość*/
function mainScriptLoad() {
    gapi.load('client:auth2', initClient);
}

/**Łączy się z odpowiednim API*/
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();
        setSigninStatus();
        GoogleAuth.isSignedIn.listen(setSigninStatus);
        var user = GoogleAuth.currentUser.get();
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    });
}

/**Obsługa przycisku autoryzacji/logowania się/wylogowywania się*/
function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        GoogleAuth.signOut();
        clearAll();
    } else {
        GoogleAuth.signIn();
    }
}

/**Przycisk zrzeknięcia się dostępu*/
function revokeAccess() {
    GoogleAuth.disconnect();
    clearAll();
}

/**Czyści wszsytkie elelmenty ekranu*/
function clearAll(){
    clearTimeout(counter);
    clearTimeout(counter2);
    $('#stats').css('visibility','hidden');
    $('div.opinions').empty();
    $('div.testo').empty();
    $('div.today').empty();
    $('p.good').empty();
    $('p.bad').empty();
    $('p.daily').empty();
    $('div.week').empty();
    $('div.row').empty();
    $('p.weekly').empty();
    $('p.worst').empty();
    $('p.lastBad').empty();
    $('p.lastGood').empty();
    $('div.lastReviews').empty();
    $('h2.reviewsTitle').empty();
    $('div.alert').css('visibility', 'hidden');
    $('#sign-in-or-out-button').css('visibility', 'visible');
}

/**Sprawdza czy użytkownik jest autoryzowany i uruchamia funkcję ładującą API jeśli tak*/
function setSigninStatus(isSignedIn) {
    let user = GoogleAuth.currentUser.get();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    /**
     APIload().then(function (response) {
        
    }).catch(function (error) {
        
    })*/
    if (isAuthorized) {
        //$('#sign-in-or-out-button').css('visibility', 'hidden');
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        //$('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
        APIload()
    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

/**Ładuje api i pobiera opinie co REFRESH ms*/
function APIload() {
    gapi.client.load('androidpublisher', 'v3').then(function () {
        let i = 0;
        var refresh = function () {
            $('div.opinions').empty();
            if (i == 0) {
                ReviewList(initialPull);
            }
            else {
                clearTimeout(counter);
                ReviewList(nextPulls);
            }
            i = +1;
            counter2 =setTimeout(refresh, REFRESH)
        };
        refresh();
        //ReviewList(initialPull);
    });
}

handleClientLoad();

