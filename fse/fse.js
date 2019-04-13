(function () {
	const { apiFetch } = wp;
	const { TextControl } = wp.components;
	const { URLInput } = wp.editor;
	const { Component, RawHTML } = wp.element;
	const { PluginPostStatusInfo, PluginSidebar } = wp.editPost;
	const { registerPlugin } = wp.plugins;

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

	class TemplateSelector extends Component {
		componentDidMount() {
			apiFetch( { path: `fse/post-template?post_id=10` } )
				.then( ( { template_id } ) => this.setState( { template_id } ) );
		}

		render() {
			return (
				el(
					PluginPostStatusInfo,
					{},
					el(
						TextControl,
						{
							label: 'Layout Template',
							value: this.state && this.state.template_id || 'Loading…',
							onChange: value => (
								this.setState( { template_id: value }, () => {
									apiFetch( { 
										path: `/fse/post-template?post_id=10&template_id=${ value }`,
										method: 'POST',
									} )
										.then( ( { template_id } ) => this.setState( { template_id } ) );
								} )
							),
						}
					)
				)
			);
		}
	}
	registerPlugin(
		'fse-layout-template-selector',
		{
			render: TemplateSelector,
		}
	);
})();