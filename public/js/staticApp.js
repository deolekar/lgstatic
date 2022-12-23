//const tagcode = document.querySelector(".tag-code");
//const hashcode = document.querySelector(".hashcode");
const searchlinkin = document.querySelector(".search-linkin");
//const editlinkin = document.querySelector(".edit-linkin");
const formLkp = document.querySelector(".formLkp");
//const copyCode = document.querySelector(".copy-code");


let urlTarget, urlSource = null;

// lkp trigger manually
searchlinkin.addEventListener("click", () => {
    if (document.getElementById("quantity").value != "") {
        getSourceUrl()
        console.log("AD: getSourceUrl called ");
    }
});

function getSourceUrl() {

    document.getElementById("idTarget").style.display = "none";
    document.getElementById("idTargetIcon").style.display = "none";
    document.getElementById("idTargetIcon").innerText = null;
    document.getElementById("idTarget").innerText = "";
    var sourceText = document.getElementById("quantity").value;
    var geturl = new RegExp("(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g");
    console.log(sourceText.match(geturl));

    //showNotification(geturl);
    let urlTarget, lnkStatus = null;
    logMyEvent("getLinkinStatic");
    //clound function
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
                document.getElementById("idTarget").style.display = "inline";
                document.getElementById("idTargetIcon").style.display = "inline";

                if (lnkStatus === "Verified") {
                    console.log("Verified");
                    document.getElementById("idTargetIcon").innerText = "verified";
                } else {
                    console.log("Unverified");
                    document.getElementById("idTargetIcon").innerText = "warning";
                }

                formLkp.querySelector(".urlTarget").href = urlTarget;
            } else {
                document.getElementById("idTargetIcon").innerText = null;
                formLkp.querySelector(".urlTarget").href = null;
                document.getElementById("idTargetUrl").innerText = "No Linkin found";
            }
            console.log(result.data);
        })
        .catch((error) => {
            console.log(error);

        });
}