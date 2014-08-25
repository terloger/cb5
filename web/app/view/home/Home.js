/**
 * Home view
 */
Ext.define('CB.view.home.Home', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-home',

    controller: 'cb-home',

    viewModel: {
        type: 'cb-home'
    },
    
    layout: {
        type: 'fit'
    },
    
    title: 'Home',
    cls: 'cb-home',
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        height: 46,
        items: [{
            xtype: 'tbtext',
            text: 'Wellcome to CLIMBuddy BETA',
            cls: 'title',
            plugins: 'responsive',
            responsiveConfig: {
                'width < 400': {
                    text: 'Wellcome'
                },
                'width >= 400': {
                    text: 'Wellcome to CLIMBuddy BETA'
                }
            }
        },'->',{
            xtype: 'cb-user-headerbutton'
        }]
    },

    items: [{
        xtype: 'container',
        //html: '<iframe id="demoVideo" src="//player.vimeo.com/video/73101095?byline=0&amp;portrait=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
        html: '<iframe id="demoVideo" src="//player.vimeo.com/video/104265260?byline=0&amp;portrait=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    }],

    listeners: {
        resize: 'resizeVideo',
        scope: 'controller'
    }

});
