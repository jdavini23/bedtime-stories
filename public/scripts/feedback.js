/**
 * Feedback Widget Script
 * This script adds a feedback widget to the website.
 * It is loaded lazily to improve initial page load performance.
 */

(function () {
  console.log('Feedback widget script loaded');

  // Initialize feedback widget when the DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // This is a placeholder for actual feedback widget functionality
    // In a real implementation, this would initialize a feedback form
    // and handle submission to a backend service

    // Create feedback button
    const createFeedbackButton = () => {
      const button = document.createElement('button');
      button.id = 'feedback-button';
      button.innerHTML = 'Feedback';
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.left = '20px';
      button.style.padding = '10px 15px';
      button.style.backgroundColor = '#7c3aed';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '5px';
      button.style.cursor = 'pointer';
      button.style.zIndex = '9999';
      button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      button.style.display = 'none'; // Hidden by default

      // Add hover effect
      button.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#6d28d9';
      });

      button.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '#7c3aed';
      });

      // Show button after 30 seconds
      setTimeout(() => {
        button.style.display = 'block';
      }, 30000);

      return button;
    };

    // Create feedback modal
    const createFeedbackModal = () => {
      const modal = document.createElement('div');
      modal.id = 'feedback-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.display = 'none';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '10000';

      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = 'white';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '10px';
      modalContent.style.maxWidth = '500px';
      modalContent.style.width = '90%';
      modalContent.style.maxHeight = '80vh';
      modalContent.style.overflow = 'auto';
      modalContent.style.position = 'relative';

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.border = 'none';
      closeButton.style.background = 'none';
      closeButton.style.fontSize = '24px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.color = '#666';

      const title = document.createElement('h3');
      title.innerHTML = 'We Value Your Feedback';
      title.style.marginTop = '0';
      title.style.marginBottom = '20px';
      title.style.color = '#333';

      const form = document.createElement('form');
      form.id = 'feedback-form';

      const ratingLabel = document.createElement('label');
      ratingLabel.innerHTML = 'How would you rate your experience?';
      ratingLabel.style.display = 'block';
      ratingLabel.style.marginBottom = '10px';

      const ratingContainer = document.createElement('div');
      ratingContainer.style.display = 'flex';
      ratingContainer.style.justifyContent = 'space-between';
      ratingContainer.style.marginBottom = '20px';

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('button');
        star.type = 'button';
        star.dataset.rating = i.toString();
        star.innerHTML = '★';
        star.style.fontSize = '24px';
        star.style.background = 'none';
        star.style.border = 'none';
        star.style.cursor = 'pointer';
        star.style.color = '#ccc';

        star.addEventListener('click', function () {
          // Reset all stars
          ratingContainer.querySelectorAll('button').forEach((s) => {
            s.style.color = '#ccc';
          });

          // Highlight selected stars
          for (let j = 1; j <= i; j++) {
            ratingContainer.querySelector(`button[data-rating="${j}"]`).style.color = '#ffc107';
          }

          // Set rating value
          form.dataset.rating = i.toString();
        });

        ratingContainer.appendChild(star);
      }

      const commentLabel = document.createElement('label');
      commentLabel.innerHTML = 'Your comments:';
      commentLabel.style.display = 'block';
      commentLabel.style.marginBottom = '10px';

      const commentInput = document.createElement('textarea');
      commentInput.style.width = '100%';
      commentInput.style.padding = '10px';
      commentInput.style.borderRadius = '5px';
      commentInput.style.border = '1px solid #ddd';
      commentInput.style.minHeight = '100px';
      commentInput.style.marginBottom = '20px';
      commentInput.style.resize = 'vertical';

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.innerHTML = 'Submit Feedback';
      submitButton.style.backgroundColor = '#7c3aed';
      submitButton.style.color = 'white';
      submitButton.style.border = 'none';
      submitButton.style.borderRadius = '5px';
      submitButton.style.padding = '10px 15px';
      submitButton.style.cursor = 'pointer';
      submitButton.style.width = '100%';

      // Add hover effect
      submitButton.addEventListener('mouseenter', function () {
        this.style.backgroundColor = '#6d28d9';
      });

      submitButton.addEventListener('mouseleave', function () {
        this.style.backgroundColor = '#7c3aed';
      });

      form.appendChild(ratingLabel);
      form.appendChild(ratingContainer);
      form.appendChild(commentLabel);
      form.appendChild(commentInput);
      form.appendChild(submitButton);

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const rating = form.dataset.rating || '0';
        const comment = commentInput.value;

        // In a real implementation, this would send the feedback to a backend service
        console.log('Feedback submitted:', { rating, comment });

        // Show thank you message
        modalContent.innerHTML = '';

        const thankYouMessage = document.createElement('div');
        thankYouMessage.style.textAlign = 'center';
        thankYouMessage.style.padding = '40px 20px';

        const icon = document.createElement('div');
        icon.innerHTML = '✓';
        icon.style.fontSize = '48px';
        icon.style.color = '#4caf50';
        icon.style.marginBottom = '20px';

        const message = document.createElement('h3');
        message.innerHTML = 'Thank You for Your Feedback!';
        message.style.marginBottom = '10px';
        message.style.color = '#333';

        const subMessage = document.createElement('p');
        subMessage.innerHTML = 'Your input helps us improve our service.';
        subMessage.style.color = '#666';

        thankYouMessage.appendChild(icon);
        thankYouMessage.appendChild(message);
        thankYouMessage.appendChild(subMessage);

        modalContent.appendChild(thankYouMessage);

        // Close modal after 3 seconds
        setTimeout(() => {
          modal.style.display = 'none';
        }, 3000);
      });

      modalContent.appendChild(closeButton);
      modalContent.appendChild(title);
      modalContent.appendChild(form);

      modal.appendChild(modalContent);

      closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
      });

      // Close modal when clicking outside
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });

      return modal;
    };

    // Add feedback elements to the page
    const feedbackButton = createFeedbackButton();
    const feedbackModal = createFeedbackModal();

    document.body.appendChild(feedbackButton);
    document.body.appendChild(feedbackModal);

    // Show modal when button is clicked
    feedbackButton.addEventListener('click', function () {
      feedbackModal.style.display = 'flex';
    });
  });
})();
