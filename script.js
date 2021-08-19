
// Grabing classes
let cursor = document.querySelector(".cursor");
let image_holder = document.querySelector(".image-holder");

// Adding Event listner to entire screen(window) so that
// cursor can move on mousemove
window.addEventListener("mousemove", animation);

// Function that make's red cursor move along
function animation (e){
  cursor.style.top = e.pageY +20 + "px";
  cursor.style.left = e.pageX + 35 + "px";
};

// Functions call
image_holder.addEventListener("mousemove" , cursor_scale);
image_holder.addEventListener("mouseleave" , cursor_descale);

// Function to scale cursor
function cursor_scale(){
  cursor.style.transform = "scale(3)";
  cursor.style.borderColor = "black";
  cursor.style.transition = " all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
  cursor.style.transitionProperty = "background,transform";
};

// Function to Descale cursor
function cursor_descale(){
    cursor.style.transform = "scale(1)";
    cursor.style.borderColor = "red";
    cursor.style.transition = " all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
    cursor.style.transitionProperty = "background,transform";
  };
  

