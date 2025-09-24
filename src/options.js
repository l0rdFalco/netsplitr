
async function openSettings() {
    try {

        chrome.storage.local.get("sl", data=>{
            let settingsLink = data.sl
            window.open(settingsLink, "_blank")
        })


    } catch (error) {
        console.error("Error generating settings link:", error);
    }
}


document.getElementById("config").addEventListener("click", openSettings)