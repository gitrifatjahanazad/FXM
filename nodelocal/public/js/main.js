let API = new Object();

API.Get = function(url) {
    try{
    document.getElementsByClassName('loading-indicator')[0].style.display = 'block';
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    let JSONParsedResult = JSON.parse(xhttp.responseText);
    document.getElementsByClassName('loading-indicator')[0].style.display = 'None';
    return JSONParsedResult;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function renderRepo(repoName, path) {
    let response = API.Get(`https://api.github.com/repos/gitrifatjahanazad/${repoName}/${path}`);
    let content = DecodeUnicode(response.content);
    let converter = new showdown.Converter(),
    html = converter.makeHtml(content);
    
    document.getElementById('content').innerHTML = html;
    document.getElementsByClassName('repo-nav')[0].classList.add('fix-repo-position');

    let allAnchorTags = document.getElementsByTagName('a');
    Array.from(allAnchorTags).forEach(item => {
        if (/.*md/.test(item.attributes.href.nodeValue)) {
            let linkContent = 'contents/' + item.attributes.href.nodeValue;
            item.attributes.href.nodeValue = '#';
            item.addEventListener("click", function(){ renderRepo(repoName, linkContent); });
        }
    });
    
    let allImageTags = document.getElementsByTagName('img');
    Array.from(allImageTags).forEach(item => {
        if (/.*png/.test(item.attributes.src.value)) {
            let isFullPathRef = /.*data.*/.test(item.attributes.src.value);
            if (!isFullPathRef) {
                let cleanUrlPortion = item.attributes.src.value.replace(/\.\.\//g,'');
                let linkContent = 'contents/' + cleanUrlPortion;
                let imageBinaryApiCall = API.Get(`https://api.github.com/repos/gitrifatjahanazad/${repoName}/${linkContent}`);
                let imageBinary = imageBinaryApiCall === null ? '' : imageBinaryApiCall.content;
                item.attributes.src.value = 'data:image/png;base64,' + imageBinary;
            }
        }
    });
}

function resetContent() {
    document.getElementById('content').innerHTML = '';
}

let gitAPIHelper = new Object();

gitAPIHelper.CleanNameForLabel = function (text) {
    return text.replace(/_/g,' ');
}

function EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    // try {
    //   let app = firebase.app();
    //   let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    //   document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    // } catch (e) {
    //   console.error(e);
    //   document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    // }

    let repositories = API.Get("https://api.github.com/users/gitrifatjahanazad/repos");
    repositories.forEach(element => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        li.appendChild(a);
        a.href = '#';
        let repoName = element.name;
        a.innerHTML = gitAPIHelper.CleanNameForLabel(repoName);
        li.addEventListener("click", function(){ renderRepo(repoName,'contents/README.md'); });
        document.getElementById('topics').appendChild(li);
    });

    resetContent();
  });


  