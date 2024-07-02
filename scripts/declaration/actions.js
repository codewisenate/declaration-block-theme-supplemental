/**
 * Actions icons DOM manipulation.
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function () {

		const iconDivs = document.querySelectorAll('.wp-block-mfb-meta-field-block.icon');

		let domain, path, json;

		// Check if the current domain matches the test domain
		const primaryDomain = 'declaration.gov.bc.ca';
		const stagingDomain = 'staging.blog.gov.bc.ca';
		if (window.location.hostname.includes(primaryDomain)) {
			domain = `https://${primaryDomain}`;
			path = '/app/uploads/sites/562/2024/06/';
			json = '/wp-json/';
		} else {
			domain = `https://${stagingDomain}`;
			path = '/app/uploads/sites/17/2024/06/';
			json = '/declaration/wp-json/';
		}

		if (iconDivs.length > 0) {

			iconDivs.forEach((div) => {
				const classNames = div.classList;

				// Find the matching class name among the four possibilities
				const className = Array.from(classNames).find((name) =>
					['engagement', 'risks', 'complexity', 'stage'].includes(name)
				);

				if (className.length > 0) {
					const valueItem = div.querySelector('.value-item');
					let number = 0;
					if (valueItem) {
						number = valueItem.innerText;
					}

					const cssIconVariableName = `--${className}-icon-level-${number}`;
					const levelName = `level-${number}`;

					const url = `${domain}${path}${className}-${number}.png`;

					document.documentElement.style.setProperty(cssIconVariableName, `url(${url})`);

					div.classList.add(levelName);
					// div.setAttribute('tabindex', 0);

					const warningLabel = {
						'stage': [
							'Action not yet reporting – salmon icon – not reporting level',
							'Action started – salmon icon – lowest level',
							'Action in planning – salmon icon – mid-level',
							'Action being implemented – salmon icon – high level',
							'Action completed – salmon icon – transformed'
						],
						'complexity': [
							'Complexity not determined – rock icon – not yet reporting level',
							'Some complexity – rock icon – lowest level',
							'Moderate complexity – rock icon – mid-level',
							'Notable complexity – rock icon – high level',
							'Complexity resolved – rock icon – transformed'
						],
						'risks': [
							'Challenges not determined – Medicine bundle icon – not yet reporting level',
							'Some challenges – Medicine bundle icon – lowest level',
							'Moderate challenges – Medicine bundle icon – mid-level',
							'Notable challenges – Medicine bundle icon – high level',
							'Challenges resolved – Medicine bundle icon – transformed'
						],
						'engagement': [
							'Engagement not determined – weaving icon – not yet reporting level',
							'Some engagement – weaving icon – lowest level',
							'Moderate engagement – weaving icon – mid-level',
							'Notable engagement – weaving icon – high level',
							'Full engagement – weaving icon – transformed'
						],
					}

					const associatedLabel = warningLabel[className][number];
					div.setAttribute('alt', `${associatedLabel}`);
					div.setAttribute('title', `${associatedLabel}`);
					div.setAttribute('tabindex', '0');
					div.setAttribute('role', 'img');
				}
			});

			async function checkActionItemsForDetailedView() {
				const url = json + 'wp/v2/actions?_embed&per_page=100';
			
				try {
					const response = await fetch(url);
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
			
					const data = await response.json();
			
					// Loop through each item in the JSON data
					for (const item of data) {
						if (item._embedded && item._embedded['wp:term']) {
							// Loop through each term in the wp:term array
							for (const termArray of item._embedded['wp:term']) {
								for (const term of termArray) {
									if (term.slug && term.slug.includes('detailed-view')) {
										console.log(`Action Item ${item.title.rendered} contains a detailed view`);
									}
								}
							}
						}
					}
				} catch (error) {
					console.error('Error fetching data:', error);
				}
			}

			// Run the function
			// checkActionItemsForDetailedView();

			// Sorts list items within ul elements based on their titles.
			const ulElements = document.querySelectorAll('.wp-block-query:not(.stories) > ul');

			if (ulElements.length > 0) {

				ulElements.forEach((ul) => {

					const sortingFunction = (a, b) => {
						const aText = a.querySelector('.wp-block-post-title').textContent;
						const bText = b.querySelector('.wp-block-post-title').textContent;

						if (aText.length > 0 && bText.length > 0) {
							return aText.localeCompare(bText, undefined, { numeric: true });
						}

						return null;
					};

					const listItems = Array.from(ul.children);
					listItems.sort(sortingFunction);

					ul.innerHTML = '';

					listItems.forEach((li) => {
						ul.appendChild(li);
					});
				});

			}


		}

		const yearElements = document.querySelectorAll('.year');

		if (yearElements.length > 0) {

			yearElements.forEach(function (yearElement) {

				const spanElement = yearElement.querySelector('.value');
				const spanValue = parseInt(spanElement.textContent);

				if (spanValue === 0) {
					spanElement.textContent = '—';
					spanElement.classList.add('lighten');
				}
			});
		}

		const actionLabels = document.querySelectorAll('.label-action');

		if (actionLabels.length > 0) {

			const hasLinkElement = (div) => {
				return div.querySelector('a') !== null;
			}

			actionLabels.forEach(function (actionLabel) {
				if (hasLinkElement(actionLabel)) {
					// actionLabel.setAttribute('role', 'group');
					actionLabel.querySelector('a').setAttribute('aria-label', `View Action ${actionLabel.textContent} details`);
				} 
			});
		}

		const yearLabels = document.querySelectorAll('.label-year-started');

		if (yearLabels.length > 0) {
			yearLabels.forEach(function (yearLabel) {
				const yearValue = yearLabel.querySelector('.value');
				yearLabel.setAttribute('aria-label', `Year action started: ${yearValue.textContent}`);
				yearLabel.setAttribute('role','text');
				yearLabel.innerText = yearValue.textContent;
				yearValue.remove();
			});
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
