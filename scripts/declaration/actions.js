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

					// Update the CSS variable value
					document.documentElement.style.setProperty(
						cssIconVariableName,
						`url(https://test.vanity.blog.gov.bc.ca/app/uploads/sites/1262/2023/06/${className}-${number}.png)`
					);

					div.classList.add(levelName);
					div.setAttribute('tabindex', 0);

					const warningLabel = {
						'stage': ['Action not started', 'Action started', 'Action in planning', 'Action being implementation', 'Action completed'],
						'complexity': ['Complexity not determined', 'Some complexity', 'Moderate complexity', 'Notable complexity', 'Complexity resolved'],
						'risks': ['Challenges not determined', 'Some challenges', 'Moderate challenges', 'Notable challenges', 'Challenges resolved'],
						'engagement': ['Engagement not determined', 'Some engagement', 'Moderate engagement', 'Notable engagement', 'Full engagement'],
					}

					const associatedLabel = warningLabel[className][number];
					div.setAttribute('aria-details', `${associatedLabel}`);

				}
			});
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
