import './declaration/actions';
import './declaration/expando';
/**
 * DOM manipulation.
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function() {
		/**
		 * Test import of util – remove when ready to use.
		 */
		const body = document.querySelector('body');
	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
