const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;
const { createElement: el } = wp.element;

const attributes = {
	args: {
		type: 'object'
	}
}

const defaultTemplate =
  [ [ 'core/cover'
    , { url: 'http://localhost/wp-content/uploads/2019/04/iframe-bridge-v2.png'
      , id: 106
      }
    , [ [ 'core/paragraph'
        , { content: 'Diagrams are gud!'
    	  , fontSize: 'large'
    	  , align: 'right'
    	  }
				]
			, [ 'core/paragraph'
				, { placeholder: 'Eat me' }
		    ]
      ] 
    ]
  , [ 'core/button'
    , { align: 'center'
      , text: 'Buy my stuff!'
      , url: 'https://wordpress.com'
      }
    ]
  , [ 'core/columns'
    , { columns: 3
      , verticalAlignment: 'center'
      }
	, [ [ 'core/column'
        , { verticalAlignment: 'center'
          }
		, [ [ 'core/image'
            , { width: 200
              , height: 133
  	        , url: 'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fgmauthority.com%2Fblog%2Fwp-content%2Fgallery%2F2015-cadillac-ats-v-r%2F2015-cadillac-ats-v-r-coupe-03.jpg&amp;f=1'
  	        }
  	        ]
    		, [ 'core/paragraph'
              , { align: 'center'
                , backgroundColor: 'primary'
  	          , content: 'Racecars!'
  	          }
            ]
	  	  ]
		]
	  , [ 'core/column'
        , { verticalAlignment: 'center'
          }
		, [ [ 'core/image'
            , { width: 200
              , height: 133
  	          , url: 'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.wonderfulengineering.com%2Fwp-content%2Fuploads%2F2014%2F05%2Fairplane-wallpaper-17.jpg&amp;f=1'
  	          }
  	        ]
  		  , [ 'core/paragraph'
            , { align: 'center'
              , backgroundColor: 'light-gray'
  	          , content: 'Airplanes!'
  	          }
            ]
		  ]
		]
	  , [ 'core/column'
        , { verticalAlignment: 'center'
          }
		, [ [ 'core/image'
            , { width: 200
              , height: 133
  	          , url: 'https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Fimg3.wikia.nocookie.net%2F__cb20120606220432%2Felderscrolls%2Fimages%2Fc%2Fc4%2FUnicorn.jpg&amp;f=1'
  	          }
  	        ]
  		  , [ 'core/paragraph'
            , { align: 'center'
              , backgroundColor: 'light-gray'
  	          , content: 'Unicorns!'
  	          }
            ]
		  ]
		]
      ]
	]
  , [ 'core/paragraph'
    , { placeholder: 'Enter in your business knowledge here'
      }
    ]
  ];


const Edit = ( { className } ) => el(
	'div', 
	{ className },
	el(
		InnerBlocks,
		{
			template: defaultTemplate
		},
		[]
	),
);

const Save = ( { className } ) => el(
	'div',
	{ className },
	el( InnerBlocks.Content, {}, [] ),
);

registerBlockType(
	'ahp/default-template',
	{
		title: 'Default Template',
		icon: 'layout',
		category: 'layout',
		attributes: attributes,
		edit: Edit,
		save: Save,
	}
);