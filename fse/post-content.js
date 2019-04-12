(function () {
	const { apiFetch } = wp;
	const { registerBlockType } = wp.blocks;
	const { RawHTML } = wp.element;

	const fetchPreview = (setAttributes, { isFetching, postId }) => {
		if (isFetching) {
			return;
		}

		setAttributes({ isFetching: true });

		apiFetch({ path: `/wp/v2/posts/${postId}` }).then(post => {
			setAttributes({ 
				preview: post.content.rendered, 
				isFetching: false,
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
				el('h2', {}, 'Post Content Preview'),
				attributes.preview && ! isSelected
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
								url
							})
						)
					}
				)
			]
		)
	);

	registerBlockType(
		'fse/post-content',
		{
			title: 'Post Content',
			icon: 'layout',
			category: 'layout',
			attributes: attributes,
			edit: Edit,
			save: ({ className }) => el(
				'div',
				{ className },
				el('p', {}, 'Your post renders here!')
			)
		}
	);
})();