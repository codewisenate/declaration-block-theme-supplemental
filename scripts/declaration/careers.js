/**
 * Careers DOM manipulation.
 * @return {void}
 */
const domCareersReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout( () => {
		// Get all job listing containers
		const jobListingContainers = document.querySelectorAll('.job-listing-container');

		// Loop through each container
		jobListingContainers.forEach(container => {
			// Find the Job Listing Title inside the container
			const titleElement = container.querySelector('.job-listing-title');
			// Find the job listing URL element inside the container
			const urlElement = container.querySelector('.job-listing-url');

			if (titleElement && urlElement) {
				// Get the URL value
				const title = titleElement.textContent;
				const url = urlElement.querySelector('.value').textContent;

				// Find the listing button link element inside the container
				const listingButtonLink = container.querySelector('.job-listing-btn a');

				if (listingButtonLink) {
					// Set the URL as the href value for the button link
					listingButtonLink.href = url;
					listingButtonLink.setAttribute('aria-label',`Go to the ${title} details page`);
				}

				// Find the LinkedIn button link element inside the container
				const linkedinButtonLink = container.querySelector('.share-linkedin a');

				if (linkedinButtonLink) {
					// Set the URL as the href value for the link
					linkedinButtonLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
					linkedinButtonLink.setAttribute('aria-label',`Share the ${title} details U.R.L.`);
				}

				// Find the Twitter button link element inside the container
				const twitterButtonLink = container.querySelector('.share-twitter a');

				if (twitterButtonLink) {
					// Set the URL as the href value for the button link
					twitterButtonLink.href = `https://twitter.com/intent/tweet?text=B.C. Public Service opportunity: ${title} – ${url}`;
					twitterButtonLink.setAttribute('aria-label',`Share the ${title} title and U.R.L.`);
				}
			}
		});
	}, 0);
};

if ('complete' === document.readyState) {
	domCareersReady();
} else {
	document.addEventListener('DOMContentLoaded', domCareersReady);
}
