const iconClass = document.querySelector(".icons");

const toggleIcon = () => {
    console.log("clicked")
    iconClass.classList.toggle("active");
}

iconClass.addEventListener("click", () => toggleIcon());