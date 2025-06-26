import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Transform the block structure into a testimonial format
  const testimonials = [];
  
  [...block.children].forEach((row) => {
    const testimonial = {};
    const cells = [...row.children];
    
    if (cells[0]) {
      // First cell: testimonial text
      testimonial.quote = cells[0].textContent.trim();
    }
    
    if (cells[1]) {
      // Second cell: author info (name, title, company)
      const authorInfo = cells[1].innerHTML.split('<br>');
      testimonial.author = authorInfo[0]?.trim() || '';
      testimonial.title = authorInfo[1]?.trim() || '';
      testimonial.company = authorInfo[2]?.trim() || '';
    }
    
    if (cells[2]) {
      // Third cell: author image (optional)
      const img = cells[2].querySelector('img');
      if (img) {
        testimonial.image = img.src;
        testimonial.alt = img.alt || testimonial.author;
      }
    }
    
    if (testimonial.quote) {
      testimonials.push(testimonial);
    }
  });

  // Clear the block and rebuild with testimonial structure
  block.innerHTML = '';
  
  testimonials.forEach((testimonial, index) => {
    const testimonialDiv = document.createElement('div');
    testimonialDiv.className = 'testimonial-item';
    
    // Quote section
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'testimonial-quote';
    quoteDiv.innerHTML = `
      <blockquote>
        <p>"${testimonial.quote}"</p>
      </blockquote>
    `;
    
    // Author section
    const authorDiv = document.createElement('div');
    authorDiv.className = 'testimonial-author';
    
    // Author image (if provided)
    if (testimonial.image) {
      const pictureElement = createOptimizedPicture(
        testimonial.image, 
        testimonial.alt, 
        false, 
        [{ width: '80' }]
      );
      pictureElement.className = 'testimonial-avatar';
      authorDiv.appendChild(pictureElement);
    }
    
    // Author info
    const authorInfo = document.createElement('div');
    authorInfo.className = 'testimonial-info';
    authorInfo.innerHTML = `
      <div class="testimonial-name">${testimonial.author}</div>
      ${testimonial.title ? `<div class="testimonial-title">${testimonial.title}</div>` : ''}
      ${testimonial.company ? `<div class="testimonial-company">${testimonial.company}</div>` : ''}
    `;
    
    authorDiv.appendChild(authorInfo);
    
    // Assemble the testimonial
    testimonialDiv.appendChild(quoteDiv);
    testimonialDiv.appendChild(authorDiv);
    
    block.appendChild(testimonialDiv);
  });
  
  // Add a wrapper class for styling
  block.classList.add('testimonial-block');
}
