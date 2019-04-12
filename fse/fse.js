// const { registerBlockType } = wp.blocks;
const { URLInput } = wp.editor;
// const { createElement: el } = wp.element;

(function () {
	const { apiFetch } = wp;
	const { RawHTML } = wp.element;

	const attributes = {
		postId: {
			type: 'number',
		},
		url: {
			type: 'string',
		}
	};

	const fetchPreview = (setAttributes, { isFetching, postId }) => {
		if (isFetching) {
			return;
		}

		setAttributes({ isFetching: true });

		apiFetch({ path: `/wp/v2/posts/${postId}` }).then(post => {
			setAttributes({
				preview: post.content.rendered,
				isFetching: false,
				title: post.title && post.title.rendered
			});
		}).catch(() => {
			apiFetch({ path: `/wp/v2/pages/${postId}` }).then(page => {
				setAttributes({
					preview: page.content.rendered,
					isFetching: false,
					title: page.title && page.title.rendered
				});
			})
		}
		)
	}

	const Edit = ({ className, attributes, isSelected, setAttributes }) => (
		attributes.preview || fetchPreview(setAttributes, attributes),
		el(
			'div',
			{ className },
			[
				el('h2', {}, attributes.title),
				attributes.preview && !isSelected
					? el(RawHTML, {}, attributes.preview)
					: el('p', {}, 'Your post renders here!'),
				isSelected && el(
					URLInput,
					{
						value: attributes.url,
						onChange: (url, post) => (
							setAttributes({
								postId: post && post.id,
								isFetching: false,
								preview: undefined,
								title: post && post.title || '',
								url
							})
						)
					}
				)
			]
		)
	);

	const Save = ({ className }) => el('div', { className }, el('p', {}, 'Your post renders here!'));

	registerBlockType(
		'fse/post-renderer',
		{
			title: 'Post Renderer',
			icon: 'layout',
			category: 'layout',
			attributes: attributes,
			edit: Edit,
			save: Save
		}
	);
})();