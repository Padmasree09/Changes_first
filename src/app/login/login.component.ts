import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    '/assets/img/infrastructure.jpeg',
    '/assets/img/estates.jpeg',
    '/assets/img/foundation.jpeg',
    '/assets/img/labs.jpeg',
  ];
  imageTexts = [
    'Infrastructure',
    'Estates and Farms',
    'Foundation',
    'Smilax Laboratories',
  ];

  signInForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      ZUSER: ['', Validators.required],
      ZPASSWORD: ['', Validators.required],
    });
    this.autoChangeImageAndText();
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const username = this.signInForm.get('ZUSER')?.value;
      const password = this.signInForm.get('ZPASSWORD')?.value;

      // Placeholder for authentication logic
      if (username && password) {
        // Navigate to the dashboard page after successful login
        this.router.navigate(['/home']);
      } else {
        // Show an error message
        alert('Please enter a valid username and password.');
      }
    } else {
      // Show an error message if the form is invalid
      alert('Form is not valid. Please fill in all required fields.');
    }
  }

  autoChangeImageAndText() {
    const intervalTime = 5000; // Time between transitions (5 seconds)

    setInterval(() => {
      const images = document.querySelectorAll('.background-img');
      const textContainer = document.querySelector(
        '.dynamic-text'
      ) as HTMLElement;

      // Remove 'active' class from the current image
      images[this.currentImageIndex].classList.remove('active');

      // Change to the next image
      this.currentImageIndex = (this.currentImageIndex + 1) % images.length;

      // Add 'active' class to the new image
      images[this.currentImageIndex].classList.add('active');

      // Change the dynamic text to match the current image
      textContainer.textContent = this.imageTexts[this.currentImageIndex];

      // Reset and reapply the text reveal animation
      textContainer.classList.remove('intro-reveal');
      setTimeout(() => {
        textContainer.classList.add('intro-reveal');
      }, 10); // Delay for the animation reset
    }, intervalTime);
  }
}
