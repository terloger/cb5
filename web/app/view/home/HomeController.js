/**
 * Home controller
 */
Ext.define('CB.view.home.HomeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.cb-home',

    resizeVideo: function() {
        var view = this.getView(),

            pad = view.bodyPadding * 2,

            video = Ext.get('demoVideo'),
            videoW = video.getWidth(),
            videoH = video.getHeight(),

            bodyW = view.body.getWidth(),
            bodyH = view.body.getHeight(),

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
