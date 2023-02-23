const searchlinkin = document.querySelector(".search-linkin");
const formLkp = document.querySelector(".formLkp");

let urlTarget, urlSource = null;

function lgRedirect() {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setHeader("Expires", "0"); // Proxies.
    window.location = 'https://en.wikipedia.org/wiki/Wikipedia:Today%27s_featured_article';
}

searchlinkin.addEventListener("click", () => {
    if (document.getElementById("quantity").value != "") {
        if (document.getElementById("idSearch").innerText === "refresh") {
            location.reload();
        }
        getSourceUrl();
    }
});

function getSourceUrl() {
    document.getElementById("idSearch").style.display = "none";
    document.getElementById("quantity").readOnly = true;
    document.getElementById("idTarget").style.display = "none";
    document.getElementById("idTargetIcon").style.display = "none";
    document.getElementById("idTargetIcon").innerText = null;
    document.getElementById("idTarget").innerText = "";
    document.getElementById("idTargetUrl").innerText = "Loading...";
    var sourceText = document.getElementById("quantity").value;
    var geturl = new RegExp("(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g");

    if (sourceText.match(geturl) != null) {
        let urlTarget, lnkStatus = null;
        //logMyEvent("getLinkinStaticEvent");
        const getLinkin = firebase.functions().httpsCallable("getLinkin");
        getLinkin({
            textSourceURL: sourceText,
            lnkStatus: lnkStatus,
            urlSource: urlSource,
            channel: 'web',
        })
            .then((result) => {
                urlTarget = result.data.opUrlTarget;
                lnkStatus = result.data.lnkStatus;
                urlSource = result.data.urlSource;

                document.getElementById("quantity").value = urlSource;

                if (urlTarget != null) {
                    document.getElementById("idTarget").innerText = "Linkin me";
                    document.getElementById("idTargetUrl").innerText =
                        lnkStatus + " - (" + urlTarget + ")";
                    //document.getElementById("setTargetUrlText").innerText = urlTarget;
                    formLkp.querySelector(".urlTargetLow").href = urlTarget;
                    document.getElementById("idTarget").style.display = "inline";
                    document.getElementById("idTargetIcon").style.display = "inline";

                    if (lnkStatus === "Verified") {
                        document.getElementById("idTargetIcon").innerText = "verified";
                    } else {
                        document.getElementById("idTargetIcon").innerText = "warning";
                    }

                    formLkp.querySelector(".urlTarget").href = urlTarget;
                } else {
                    document.getElementById("idTargetIcon").innerText = null;
                    formLkp.querySelector(".urlTarget").href = null;
                    document.getElementById("idTargetUrl").innerText = "No Linkin found";
                }
            })
            .catch((error) => {
                //console.log(error);
            });
    } else {
        document.getElementById("idTargetUrl").innerText = "Linkin Not Found.";
    }

    document.getElementById("idSearch").innerText = "refresh";
    document.getElementById("idSearch").style.display = "inline";
}