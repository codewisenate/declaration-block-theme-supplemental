/**
 * Actions icons DOM manipulation.
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function() {

		const iconDivs = document.querySelectorAll('.wp-block-mfb-meta-field-block.icon');
		iconDivs.forEach((div) => {
		  const classNames = div.classList;
		
		  // Find the matching class name among the four possibilities
		  const className = Array.from(classNames).find((name) =>
			['engagement', 'risks', 'complexity', 'stage'].includes(name)
		  );
		
		  if (className) {
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
				'stage': ['Not started', 'Started', 'Planning', 'Implementation', 'Completed'],
				'complexity': ['Complexity not determined', 'Some complexity', 'Moderate complexity', 'Notable complexity', 'Complexity resolved'],
				'risks': ['Challenges not determined', 'Some challenges', 'Moderate challenges', 'Notable challenges', 'Challenges resolved'],
				'engagement': ['Engagement not determined', 'Some engagement', 'Moderate engagement', 'Notable engagement', 'Full engagement'],
			}

			const associatedLabel = warningLabel[className][number];
			div.setAttribute('aria-label', `${associatedLabel}`);

		  }
		});
		
	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
