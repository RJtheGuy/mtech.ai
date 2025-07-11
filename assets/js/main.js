// Navbar scroll effect
// window.addEventListener('scroll', function() {
//     const navbar = document.querySelector('.navbar');
//     if (window.scrollY > 50) {
//       navbar.classList.add('scrolled');
//     } else {
//       navbar.classList.remove('scrolled');
//     }
//   });
  
  // Animate elements on scroll
  // document.addEventListener('DOMContentLoaded', function() {
  //   const animateElements = document.querySelectorAll('.animate__animated');
    
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('animate__fadeInUp');
  //       }
  //     });
  //   }, { threshold: 0.1 });
    
  //   animateElements.forEach(el => observer.observe(el));
    
    // Smooth scroll for anchor links
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //   anchor.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     const target = document.querySelector(this.getAttribute('href'));
    //     if (target) {
    //       window.scrollTo({
    //         top: target.offsetTop - 70,
    //         behavior: 'smooth'
    //       });
    //     }
    //   });
    // });

 // document.getElementById('contactPageBtn').addEventListener('click', function() {
  // Get the modal instance
//   const modal = bootstrap.Modal.getInstance(document.getElementById('demoRequestModal'));
  
//   // Hide the modal first
//   modal.hide();
  
//   // Wait for the modal to fully close, then navigate
//   document.getElementById('demoRequestModal').addEventListener('hidden.bs.modal', function() {
//     // Navigate to contact section
//     document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
//   }, { once: true }); // Use once: true to ensure the event listener only runs once
// });
    
//     // Set current year in footer
//     document.getElementById('currentYear').textContent = new Date().getFullYear();
//   });






document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.animate__animated');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__fadeInUp');
        }
      });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      });
    });

    // Handle "Contact Page" button in modal
    const contactPageBtn = document.getElementById('contactPageBtn');
    if (contactPageBtn) {
        contactPageBtn.addEventListener('click', function() {
            // Dismiss the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('demoRequestModal'));
            if (modal) {
                modal.hide();
            }

            // Scroll to the contact section
            setTimeout(() => { // Small delay to allow modal to dismiss
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300); // Adjust delay if needed
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
