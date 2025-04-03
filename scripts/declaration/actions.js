/**
 * Actions icons DOM manipulation.
 * @return {void}
 */
const domActionsReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout( () => {

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
				const actionEl = div.closest('.action-results-container').querySelector('h3.wp-block-post-title');
				let actionValue = '';
				if (actionEl) { actionValue = actionEl.textContent || ''; }

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
							['Action not yet reporting – salmon icon – not reporting level','Not yet reporting'],
							['Action started – salmon icon – lowest level','Started'],
							['Action in planning – salmon icon – mid-level','Planning'],
							['Action being implemented – salmon icon – high level','Implementation'],
							['Action completed – salmon icon – transformed','Completed']
						],
						'complexity': [
							['Complexity not determined – rock icon – not yet reporting level','Not yet reporting'],
							['Some complexity – rock icon – lowest level','Some complexity'],
							['Moderate complexity – rock icon – mid-level','Moderate complexity'],
							['Notable complexity – rock icon – high level','Notable complexity'],
							['Complexity resolved – rock icon – transformed','Complexity resolved']
						],
						'risks': [
							['Challenges not determined – Medicine bundle icon – not yet reporting level','Not yet reporting'],
							['Some challenges – Medicine bundle icon – lowest level','Some challenges'],
							['Moderate challenges – Medicine bundle icon – mid-level','Moderate challenges'],
							['Notable challenges – Medicine bundle icon – high level','Notable challenges'],
							['Challenges resolved – Medicine bundle icon – transformed','Challenges resolved']
						],
						'engagement': [
							['Engagement not determined – weaving icon – not yet reporting level','Not yet reporting'],
							['Some engagement – weaving icon – lowest level','Some engagement'],
							['Moderate engagement – weaving icon – mid-level','Moderate engagement'],
							['Notable engagement – weaving icon – high level','Notable engagement'],
							['Full engagement – weaving icon – transformed','Full engagement']
						],
					}

					const associatedAltLabel = warningLabel[className][number][0];
					const associatedLevelLabel = warningLabel[className][number][1];
					div.setAttribute('alt', `Action ${actionValue} – ${associatedAltLabel}`);
					div.setAttribute('title', `${associatedLevelLabel}`);
					div.setAttribute('data-level', `${associatedLevelLabel}`);
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
	domActionsReady();
} else {
	document.addEventListener('DOMContentLoaded', domActionsReady);
}
