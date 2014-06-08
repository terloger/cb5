/**
 * Home view
 */
Ext.define('CB.view.home.Home', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'cb-home',
    
    layout: {
        type: 'fit'
    },
    
    title: 'Home',
    
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        plugins: 'responsive',
        responsiveConfig: {
            tall: {
                height: 66
            },
            wide: {
                height: 96
            }
        },
        items: [{
            xtype: 'tbtext',
            text: 'Wellcome to CLIMBuddy beta',
            cls: 'title'
        }]
    },
    
    items: [{
        xtype: 'container',
        html: '<iframe src="//player.vimeo.com/video/73101095?byline=0&amp;portrait=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    }]
    
});
