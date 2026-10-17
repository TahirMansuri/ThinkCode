// --- About & Contact Pages Interactivity ---
function initPages(){
  const contactForm = $("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", e=>{
      e.preventDefault();
      const name = $("cName").value.trim();
      const email = $("cEmail").value.trim();
      const msg = $("cMsg").value.trim();
      const status = $("formStatus");

      if(!name || !email || !msg){
        if(status){
          status.className = "form-status error";
          status.textContent = "Please fill in all required fields.";
          status.style.display = "flex";
        }
        return;
      }

      // Simulate success
      if(status){
        status.className = "form-status success";
        status.textContent = "✔ Thank you, " + name + "! Your message has been recorded.";
        status.style.display = "flex";
      }
      contactForm.reset();
      if(typeof dsSfx === "function") dsSfx("ok");
      setTimeout(()=>{
        if(status) status.style.display = "none";
      }, 5000);
    });
  }
}
