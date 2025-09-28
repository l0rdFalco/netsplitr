// DOM Elements
const chromeBtn = document.getElementById("chromeBtn");
const edgeBtn = document.getElementById("edgeBtn");
const checkBtn = document.getElementById("checkBtn");
const emailInput = document.getElementById("emailInput");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");

const extensionModal = document.getElementById("extensionModal");
const optInModal = document.getElementById("optInModal");
const successModal = document.getElementById("successModal");
const closeExtensionModal = document.getElementById("closeExtensionModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");
const refreshBtn = document.getElementById("refreshBtn");
const refreshBtn2 = document.getElementById("refreshBtn2");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const userEmail = document.getElementById("userEmail");

// Step elements
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

function sendToExtension() {
  // Send message to extension
  window.postMessage(
    {
      type: "FROM_PAGE",
      tag: "apache?",
    },
    "*"
  );
}

// Listen for extension messages
window.addEventListener("message", (event) => {
  // Verify the message is from your extension
  if (event.data?.type && event.data.type === "FROM_EXTENSION_JUST_INSTALLED") {
    console.log("Received from extension:", event.data.payload);
    step1.style.display = "none";
    nextStep()
    // Handle the message
  } else if (
    event.data?.type === "FROM_EXTENSION" &&
    event.data.payload.response === "comanche!"
  ) {
    const status = event.data.payload.optInStatus;
    console.log("from extension received:", status);

    if (status) {
      extensionModal.style.display = "none";
      optInModal.style.display = "none";
      step2.style.display = "none";

      nextStep();
    } else {
      extensionModal.style.display = "none";
      optInModal.style.display = "flex";
      //show error message on modal to show that user should opt in. Modal can have image
    }
  } else if (event.data?.type === "FROM_PAGE" && event.data.tag === "apache?") {
    extensionModal.style.display = "flex";
    console.log("extension not found");
  } else {
    console.log("errant events!");
  }
});

// Current step tracking
let currentStep = 1;

// Update progress bar
function updateProgress() {
  progress.style.width = `${(currentStep - 1) * 50}%`;
}

// Move to next step
function nextStep() {
  if (currentStep < 3) {
    document.getElementById(`step${currentStep}`).classList.remove("active");
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add("active");

    // Enable next step's button
    if (currentStep === 2) {
      checkBtn.disabled = false;
    } else if (currentStep === 3) {
      emailInput.disabled = false;
      submitBtn.disabled = false;
    }

    updateProgress();
  }
}

// Event Listeners
chromeBtn.addEventListener("click", function () {
  window.open(
    "https://chromewebstore.google.com/detail/html-and-image-blocker/nhfajgkmnbpipocfjaadilofjbgjpdof",
    "_blank"
  );

  // In a real implementation, this would redirect to the actual extension page
  setTimeout(() => {
    nextStep();
  }, 1000);
});

edgeBtn.addEventListener("click", function () {
  window.open(
    "https://microsoftedge.microsoft.com/addons/detail/netsplitr/popjgjfnokabiinmfbfjcmgmpoadalen",
    "_blank"
  );

  // In a real implementation, this would redirect to the actual extension page
  setTimeout(() => {
    nextStep();
  }, 1000);
});

checkBtn.addEventListener("click", function () {
  // Simulate extension detection (in a real implementation, this would check for the extension)
  sendToExtension();
});

submitBtn.addEventListener("click", function () {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Please enter your email address");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Show success modal
  userEmail.textContent = email;
  successModal.style.display = "flex";
  step3.style.display = "none";

});

// Modal close events
closeExtensionModal.addEventListener("click", function () {
  extensionModal.style.display = "none";
});

closeSuccessModal.addEventListener("click", function () {
  successModal.style.display = "none";
});

closeSuccessBtn.addEventListener("click", function () {
  successModal.style.display = "none";
});

refreshBtn.addEventListener("click", function () {
  location.reload();
});

refreshBtn2.addEventListener("click", function () {
  location.reload();
});

// Close modals when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === extensionModal) {
    extensionModal.style.display = "none";
  }
  if (event.target === successModal) {
    successModal.style.display = "none";
  }
});

// Email validation function
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Initialize progress bar
updateProgress();
