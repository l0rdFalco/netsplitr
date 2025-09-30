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

// Image array
const items = [
  "coffee_machine_1.png",
  "coffee_machine_2.png",
  "controller_1.png",
  "gaming_headset_1.png",
  "gaming_headset_2.png",
  "switch_1.png",
  "switch_2.png",
  "thinkpad_1.png",
];

// DOM elements
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const indicatorsContainer = document.querySelector(".carousel-indicators");
const autoPlayToggle = document.querySelector(".auto-play-toggle");
const currentImageSpan = document.getElementById("current-image");
const totalImagesSpan = document.getElementById("total-images");

// State variables
let currentIndex = 0;
let autoPlayInterval;
let isAutoPlaying = true;
const autoPlayDelay = 3000; // 3 seconds

// Initialize carousel
function initCarousel() {
  // Set total images count
  totalImagesSpan.textContent = items.length;

  // Create carousel items and indicators
  items.forEach((item, index) => {
    // Create carousel item
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";

    // Create image element
    const img = document.createElement("img");
    img.src = `${encodeURIComponent(item)}`;
    img.alt = item.replace(/_/g, " ").replace(".png", "");

    carouselItem.appendChild(img);
    carousel.appendChild(carouselItem);

    // Create indicator
    const indicator = document.createElement("div");
    indicator.className = "indicator";
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  // Start auto-play
  startAutoPlay();
}

// Update carousel position
function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update indicators
  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentIndex);
  });

  // Update counter
  currentImageSpan.textContent = currentIndex + 1;
}

// Go to specific slide
function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
}

// Previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
}

// Start auto-play
function startAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  isAutoPlaying = true;
  autoPlayToggle.textContent = "Pause Auto-Play";
}

// Stop auto-play
function stopAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  isAutoPlaying = false;
  autoPlayToggle.textContent = "Start Auto-Play";
}

// Event listeners
prevBtn.addEventListener("click", () => {
  prevSlide();
  if (isAutoPlaying) {
    stopAutoPlay();
    startAutoPlay();
  }
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  if (isAutoPlaying) {
    stopAutoPlay();
    startAutoPlay();
  }
});

autoPlayToggle.addEventListener("click", () => {
  if (isAutoPlaying) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
});

// Initialize the carousel
initCarousel();

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
    nextStep();
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
    "https://chromewebstore.google.com/detail/netsplitr-idle-bandwidth/efeffegfikdfcimfojmiclbobjalablp",
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
