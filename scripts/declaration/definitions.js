/**
 * General CleanBC Definitons dialog generator.
 */
const domDefnitionsReady = () => {
    /*
     * SafarIE iOS requires window.requestAnimationFrame update.
     */
    window.requestAnimationFrame(() => {
        const links = document.querySelectorAll('a');

        const definitionLinks = Array.from(links).filter((link) => {
            return link.href.includes('definitions');
        });

        /**
         * Adds event listeners for click and keypress events to the specified element.
         *
         * @param {HTMLElement} element - The DOM element to which the event listeners will be added.
         * 
         * @fires click - Triggered when the element is clicked.
         * @fires keypress - Triggered when a key is pressed while the element is focused.
         */
        const addEventListeners = (element) => {
            element.addEventListener('click', handleClick);
            element.addEventListener('keypress', handleKeypress);
        }

        /**
         * Handles click and keypress events, fetching and displaying content based on a URL.
         * 
         * @async
         * @param {Event} event - The event object triggered by a user interaction.
         * @property {string} event.type - The type of the event (e.g., 'click', 'keypress').
         * @property {string} [event.key] - The key pressed during a keypress event (e.g., 'Enter').
         * @property {HTMLElement} event.currentTarget - The element on which the event listener is attached.
         * 
         * @throws {Error} Throws an error if the fetch operation fails or required elements are not found.
         * 
         * @description
         * - If the event is a `click` or a `keypress` with the `Enter` key, the function prevents the default action.
         * - It checks if the URL's content is cached in `sessionStorage`.
         * - If cached, it retrieves and displays the content.
         * - If not cached, it fetches the content from the URL, parses it, and displays it.
         * - The fetched content is cached in `sessionStorage` for future use.
         */
        const handleClick = async (event) => {
            if (
                'click' === event.type ||
                ('keypress' === event.type && 'Enter' === event.key)
            ) {
                event.preventDefault();
                const url = event.currentTarget.getAttribute('href');
                const cachedData = window.sessionStorage.getItem(url);
                
                if (cachedData) {
                    const { title, content } = JSON.parse(cachedData);
                    displayContent(title, content);
                } else {
                    try {
                        const response = await fetch(url);
        
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
        
                        const html = await response.text();
                        const parser = new window.DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
        
                        const titleElement = doc.querySelector('.wp-block-post-title');
                        const contentElement = doc.querySelector('.entry-content');
        
                        if (!titleElement || !contentElement) {
                            throw new Error(
                                'Required content not found in the fetched HTML.'
                            );
                        }
        
                        const title = titleElement.innerText;
                        const content = contentElement.innerHTML;
                        const dataToCache = { title, content };
        
                        window.sessionStorage.setItem(url, JSON.stringify(dataToCache));
                        displayContent(title, content);
                    } catch (error) {
                        console.error('Error fetching content:', error);
                    }
                }
            }
        }
        

        /**
         * Handles keypress events, triggering the `handleClick` function if the Enter key is pressed.
         * 
         * @param {KeyboardEvent} event - The keyboard event object.
         * @property {string} event.key - The name of the key pressed (e.g., 'Enter').
         * @property {number} [event.keyCode] - The numeric keycode of the key pressed (e.g., 13 for Enter).
         * 
         * @description
         * - Checks if the key pressed is the Enter key.
         * - If the Enter key is detected, the function delegates handling to the `handleClick` function.
         */
        const handleKeypress = (event) => {
            if ('Enter' === event.key || 13 === event.keycode) {
                handleClick(event);
            }
        }

        /**
         * Displays the specified content in a dialog and sets focus on the title.
         * 
         * @param {string} title - The title to be displayed in the dialog.
         * @param {string} content - The HTML content to be displayed in the dialog.
         * 
         * @description
         * - Updates the content of the dialog's `.dialog-content` element.
         * - Sets the `tabindex` of the title to `0` to make it focusable.
         * - Calls `showDialog()` to display the dialog.
         * - Moves focus to the title (`<h2>` element) after rendering.
         */
        const displayContent = (title, content) => {
            const dialogContent = document.querySelector(
                '#dialog .dialog-content'
            );
            dialogContent.innerHTML =
                '<h2 tabindex="0">' + title + '</h2>' + content;
            showDialog();
            dialogContent.querySelector('h2').focus();
        }

        /**
         * Displays a dialog element using the `showModal` method.
         * 
         * @description
         * - Retrieves the dialog element with the ID `dialog`.
         * - Opens the dialog using the `showModal()` method, which displays it as a modal dialog.
         * 
         * @throws {TypeError} Throws an error if the dialog element does not exist or is not a valid HTMLDialogElement.
         */
        const showDialog = () => {
            const dialog = document.getElementById('dialog');
            dialog.showModal();
        }


        if (definitionLinks.length > 0) {
            const dialog = document.createElement('dialog');
            dialog.id = 'dialog';
            dialog.className = 'dialog';
            dialog.setAttribute('aria-modal', true);
            dialog.setAttribute('aria-live', 'polite');
            dialog.innerHTML =
                '<div class="dialog-content"></div><button id="close-dialog" aria-label="closes defintion dialog">Close</button>';
            document.body.appendChild(dialog);

            const closeDialogButton = document.getElementById('close-dialog');

            closeDialogButton.addEventListener('click', () => {
                dialog.close();
            });

            definitionLinks.forEach((link) => {
                link.classList.add('icon-definition');
                link.setAttribute(
                    'aria-label',
                    'opens definition dialog for this concept'
                );

                const linkText = link.textContent;

                if (linkText && linkText.trim().length > 0) {

                    const words = linkText.trim().split(' ');
                    const lastWord = words.pop(); 
                    const restOfText = words.join(' '); 

                    // Create a span element for the last word
                    const span = document.createElement('span');
                    span.classList.add('last-word', 'no-wrap');
                    span.textContent = lastWord;

                    link.innerHTML = `${restOfText} `;
                    link.appendChild(span);
                }

                addEventListeners(link);
            });

        }


        // Glossary query loop processing to add separation headlines by letter of the alphabet.
		const glossaryList = document.querySelector('.glossary-results ul');
		
        if (glossaryList) {
			const items = Array.from(glossaryList.querySelectorAll('li'));
			let currentLetter = '';
		
			items.forEach(item => {
				const titleElement = item.querySelector('h3');
				if (titleElement) {
					const titleText = titleElement.textContent.trim();
					const firstLetter = titleText.charAt(0).toUpperCase();
		
					if (firstLetter !== currentLetter) {
						currentLetter = firstLetter;
		
						// Create and wrap the <h2>
						const h2 = document.createElement('h2');
						h2.textContent = currentLetter;
		
						const h2Wrapper = document.createElement('li');
						h2Wrapper.classList.add('glossary-letter-headline');
						h2Wrapper.appendChild(h2);
		
						// Insert the new <li> with <h2> before the current item
						glossaryList.insertBefore(h2Wrapper, item);
					}
				}
			});
		}


    });
};

if ('complete' === document.readyState) {
    domDefnitionsReady();
} else {
    document.addEventListener('DOMContentLoaded',
        domDefnitionsReady
    );
}
