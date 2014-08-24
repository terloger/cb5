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
    cls: 'cb-home',
    bodyPadding: 20,
    
    tbar: {
        ui: 'header',
        height: 46,
        items: [{
            xtype: 'tbtext',
            text: 'Wellcome to CLIMBuddy BETA',
            cls: 'title'
        },'->',{
            xtype: 'cb-user-headerbutton'
        }]
    },

    items: [{
        xtype: 'container',
        html: '<iframe id="demoVideo" src="//player.vimeo.com/video/73101095?byline=0&amp;portrait=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    }],

    listeners: {
        resize: 'resizeVideo',
        scope: 'this'
    },

    resizeVideo: function() {
        console.log('resizeVideo');
        var pad = this.bodyPadding * 2,

            video = Ext.get('demoVideo'),
            videoW = video.getWidth(),
            videoH = video.getHeight(),

            bodyW = this.body.getWidth(),
            bodyH = this.body.getHeight(),

            newW = bodyW - pad,
            newH = bodyH - pad,

            wr = newW / videoW,
            hr = newH / videoH;

        if (wr < hr) {
            newH = videoH * wr;
        } else {
            newW = videoW * hr;
        }

        video.setWidth(newW);
        video.setHeight(newH);
    }
    
});
