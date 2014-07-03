/**
 * Climbuddy paperjs touch mixin
 */
Ext.define('CB.paper.Touch', {
    
    config: {
        scale: 1,
        startScale: 1,
        translateX: 0,
        translateY: 0,
        
        swipeDistanceMin: 100,
        swipeDurationMax: 300,
        
        animateDuration: 150
    },
    
    constructor: function() {
        this.getCanvas().on({
            touchstart: this.onPaperTouchStart,
            touchmove: this.onPaperTouchMove,
            touchend: this.onPaperTouchEnd,
            touchcancel: this.onPaperTouchEnd,
            swipe: this.onPaperSwipe,
            scope: this
        });
    },
    
    onPaperTouchStart: function(e) {
        console.log('onTouchStart');
        e = e.event;
        
        switch (e.touches.length) {
            case 1:
                
                // set touch action
                this.touchAction = 'moving';
                
                // get start touches
                this.startX0 = e.touches[0].pageX;
                this.startY0 = e.touches[0].pageY;
                
                break;
                
            case 2:
                
                // set touch action
                this.touchAction = 'zooming';
                
                // get start touches
                this.startX0 = e.touches[0].pageX;
                this.startY0 = e.touches[0].pageY;
                this.startX1 = e.touches[1].pageX;
                this.startY1 = e.touches[1].pageY;

                // get start center
                this.startCenterX = (this.startX0 + this.startX1) / 2;
                this.startCenterY = (this.startY0 + this.startY1) / 2;

                // get start distance between fingers
                this.startDistance = Math.sqrt(Math.pow((this.startX1 - this.startX0), 2) + Math.pow((this.startY1 - this.startY0), 2));
                
                break;
        }
    },
    
    onPaperTouchMove: function(e) {
        console.log('onTouchMove');
        e = e.event;
        
        switch (this.touchAction) {
            case 'moving':
                
                // get end touches
                var endX0 = e.touches[0].pageX;
                var endY0 = e.touches[0].pageY;
                
                // calculate new translation points
                var translateX = this.getTranslateX() + (endX0 - this.startX0);
                var translateY = this.getTranslateY() + (endY0 - this.startY0);
                
                // set transform properties
                this.setTranslateX(translateX);
                this.setTranslateY(translateY);
                
                // apply transform
                this.applyTransform();
                
                // reset start touches
                this.startX0 = endX0;
                this.startY0 = endY0;
                
                break;
                
            case 'zooming':
            
                // get end touches
                var endX0 = e.touches[0].pageX;
                var endY0 = e.touches[0].pageY;
                var endX1 = e.touches[1].pageX;
                var endY1 = e.touches[1].pageY;

                // get end center
                var endCenterX = (endX0 + endX1) / 2;
                var endCenterY = (endY0 + endY1) / 2;

                // get end distance between fingers
                var endDistance = Math.sqrt(Math.pow((endX1 - endX0), 2) + Math.pow((endY1 - endY0), 2));

                // get distance difference
                var distanceDiff = endDistance / this.startDistance;

                // calculate scale and ratio
                var scale = this.getScale();
                var startScale = this.getStartScale();
                var newScale = startScale * distanceDiff;
                
                var ratio = newScale / scale;
                
                // get center position within image
                var mx = endCenterX - this.getImage().getX();
                var my = endCenterY - this.getImage().getY();
                
                // get center position within image after resize
                var nx = mx * ratio;
                var ny = my * ratio;

                // get translation difference because of zooming
                var zx = mx - nx;
                var zy = my - ny;
                
                // get translation difference because of moving
                var tx = endCenterX - this.startCenterX;
                var ty = endCenterY - this.startCenterY;
                
                // calculate new translation
                var translateX = this.getTranslateX() + zx + tx;
                var translateY = this.getTranslateY() + zy + ty;
                
                // set transform properties
                this.setScale(newScale);
                this.setTranslateX(translateX);
                this.setTranslateY(translateY);
                
                // apply transform
                this.applyTransform();
                
                // reset start touches
                this.startX0 = endX0;
                this.startY0 = endY0;
                this.startX1 = endX1;
                this.startY1 = endY1;
                
                // reset start center
                this.startCenterX = endCenterX;
                this.startCenterY = endCenterY;
                
                break;
        }
    },
    
    onPaperTouchEnd: function(e) {
        switch (this.touchAction) {
            case 'zooming':
                this.setStartScale(this.getScale());
                break;
        }
        
        this.touchAction = null;
    },
    
    onPaperSwipe: function(e, node, options) {
        // limit swipe distance and duration
        if (e.distance < this.getSwipeDistanceMin() || e.duration > this.getSwipeDurationMax()) {
            if (e.distance < this.getSwipeDistanceMin()) console.log('too short distance');
            if (e.duration > this.getSwipeDurationMax()) console.log('too long duration');
            return;
        }
        
        var file = (e.direction === 'left') ? this.getPrevFile() : this.getNextFile(),
            image = this.getImage(),
            s = this.getScale(),
            x = this.getTranslateX(),
            y = this.getTranslateY(),
            w = this.getImageWidth() * s,
            h = this.getImageHeight() * s,
            d = this.getAnimateDuration(),
            t = 'all ' + d + 'ms';
    
        if (!file) {
            return;
        }
            
        // add transition effect
        image.setStyle({
            '-webkit-transition': t,
            '-moz-transition':    t,
            '-o-transition':      t,
            'transition':         t
        });

        // trigger animation
        this.setScale(0);
        this.setTranslateX(x + (w / 2));
        this.setTranslateY(y + (h / 2));
        this.applyTransform();

        // animation callback
        Ext.defer(function(){

            // remove transition effect
            image.setStyle({
                '-webkit-transition': 'none',
                '-moz-transition':    'none',
                '-o-transition':      'all 0 ease-in',
                'transition':         'none'
            });

            // show new image
            this.setFile(file);

        }, d, this);
    }

});
