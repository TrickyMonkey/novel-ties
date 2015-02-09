/*jslint browser: true*/
/*jslint indent: 4 */
/*global $, jQuery, alert*/

var DEFAULT_CANVAS_WIDTH = 1600,
    DEFAULT_CANVAS_HEIGHT = 1200,
    DEFAULT_TEXT_WINDOW_MARGIN = 15,
    DEFAULT_TEXT_WINDOW_PADDING = 15,
    DEFAULT_FONT_SIZE = 25;

/**
 * @classdesc 物語における背景クラス
 * @constructor
 * @param {Number} dw 描画先幅
 * @param {Number} dh 描画先高さ
 */
var __Background__ = function(id, imageUri, dw, dh) {
    'use strict';
    this.id = id;
    this.imageUri = imageUri;
    this.loadedImage = null;
    this.isPlayable = false;
    this.dw = dw;
    this.dh = dh;
    this.zIndex = 0;
};

/**
 * オブジェクト生成時に与えられたURIの画像をロードする
 */
__Background__.prototype.loadImage = function() {
    var background = this,
        image = new Image();
    image.addEventListener("load", function () {
        background.loadedImage = image;
        background.isPlayable = true;
    }, false);
    image.src = background.imageUri;
};

/**
 * ロードした画像を描画する
 *
 * @param {CanvasRenderingContext2D} context コンテキスト
 * @param {Number} dw 描画先幅
 * @param {Number} dh 描画先高さ
 * @return {Boolean} 描画したか否か
 */
__Background__.prototype.play = function(context) {
    var background = this;
    if (background.isPlayable === true) {
        context.drawImage(background.loadedImage, 0, 0, background.dw, background.dh);
    } else {
        setTimeout( function() { background.play(context); }, 500);
    }
};

/**
 * @classdesc 物語における人物クラス
 * @constructor
 * @param {Number} dx 描画先x座標
 * @param {Number} dy 描画先y座標
 * @param {Number} dw 描画先幅
 * @param {Number} dh 描画先高さ
 */
var __Character__ = function(id, name, imageUris, dx, dy, dw, dh) {
    'use strict';
    this.id = id;
    this.name = name;
    this.imageUris = imageUris;
    this.numImages = imageUris.length;
    this.loadedImages = [];
    this.numLoadedImages = 0;
    this.isPlayable = false;
    this.dx = dx;
    this.dy = dy;
    this.dw = dw;
    this.dh = dh;
    this.zIndex = 100;
}

/**
 * オブジェクト生成時に与えられたURIの画像をロードする
 */
__Character__.prototype.loadImages = function() {
    'use strict';
    var character = this;
    if (character.imageUris !== 0) {
        var image = new Image();
        image.addEventListener("load", function () {
            character.numLoadedImages += 1;
            character.loadedImages.push(image);
            if (character.numLoadedImages === character.numImages) {
                character.isPlayable = true;
            } else {
                character.loadImages();
            }
        }, false);
        image.src = character.imageUris[character.loadedImages.length];
    } else {
        character.isPlayable = true;
    }
};

/**
 * ロードした画像を描画する
 *
 * @param {CanvasRenderingContext2D} context コンテキスト
 * @return {Boolean} 描画したか否か
 */
__Character__.prototype.play = function(context) {
    'use strict';
    var i = 0,
        character = this;
    if (character.isPlayable === true) {
        for (i = 0; i < character.numImages; i += 1) {
            context.drawImage(character.loadedImages[i], character.dx, character.dy, character.dw, character.dh);
        }
        return true;
    } else {
        setTimeout( function() { character.play(context); }, 500);
    }
};

/**
 * @classdesc 物語における人物クラス
 * @constructor
 * @param {String} text 表示する文字列
 * @param {Number} canvasWidth キャンバスの幅
 * @param {Number} canvasHeight キャンバスの高さ
 * @param {Number} margin テキストウィンドウのマージン
 * @param {Number} padding テキストウィンドウのパディング
 * @param {Number} fontSize フォントサイズ
 */
var __TextWindow__ = function(text, canvasWidth, canvasHeight, margin, padding, fontSize) {
    'use strict';
    this.text = text;
    this.cw = typeof canvasWidth !== 'undefined' ? canvasWidth : DEFAULT_CANVAS_WIDTH;
    this.ch = typeof canvasHeight !== 'undefined' ? canvasHeight : DEFAULT_CANVAS_HEIGHT;
    this.margin = typeof margin !== 'undefined' ? margin : DEFAULT_TEXT_WINDOW_MARGIN;
    this.padding = typeof padding !== 'undefined' ? padding : DEFAULT_TEXT_WINDOW_PADDING;
    this.fontSize = typeof fontSize !== 'undefined' ? fontSize : DEFAULT_FONT_SIZE;
    this.width = this.cw - 2 * this.margin;
    this.height = 3 * this.fontSize + 2 * this.padding;
    this.dx = this.margin;
    this.dy = this.ch - this.height - this.margin;
    this.zIndex = 200;
}

__TextWindow__.prototype.__fillText = function(context, text) {
    'use strict';
    var i = 0, texts = [""], c = "", line = 0;
    for (i = 0; i < text.length; i += 1) {
        c = text.charAt(i);
        if (context.measureText(texts[line] + c).width + 2 > this.width - 2 * this.padding) {
            line += 1;
            texts[line] = "";
        }
        texts[line] += c;
    }
    var x = this.dx + this.padding,
        y = this.dy + this.padding;
    for (i = 0; i <= line; i += 1) {
        context.fillText(texts[i], x, y + this.fontSize * (i + 1));
    }
};

__TextWindow__.prototype.__finalize = function(context) {
    'use strict';
    context.fillStyle = "#000000";
    context.globalAlpha = 1.0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
};

/**
 * テキストウィンドウを描画する
 *
 * @param {CanvasRenderingContext2D} context コンテキスト
 * @return {Boolean} 描画したか否か
 */
__TextWindow__.prototype.play = function(context) {
    'use strict';
    // text window
    context.fillStyle = "#000000";
    context.globalAlpha = 0.5;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.fillRect(this.dx, this.dy, this.width, this.height);
    // text
    context.font = 'normal ' + this.fontSize + 'px' +
        ' "Hiragino Maru Gothic Pro", "HG丸ゴシックM-PRO", arial, sans-serif';
    context.fillStyle = "#ffffff";
    context.globalAlpha = 1.0;
    context.shadowColor = "#000000";
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;
    this.__fillText(context, this.text);
    this.__finalize(context);
    return true;
};

/**
 * @classdesc 物語における人物クラス
 * @constructor
 * @param {String} id 識別子
 * @param {Array} entities エンティティの配列
 */
var __Stage__ = function(id, entities) {
    'use strict';
    this.id = id;
    this.entities = entities.sort(this.compareEntities);
    this.numEntities = entities.length;
};

__Stage__.prototype.compareEntities = function(a, b) {
    'use strict';
    return a.zIndex - b.zIndex;
};

/**
 * ロードされたエンティティを描画する
 * 各エンティティは先にロードしておかなければならない
 *
 * @param {CanvasRenderingContext2D} context コンテキスト
 * @return {Boolean} 描画したか否か
 */
__Stage__.prototype.play = function(context) {
    'use strict';
    var i = 0, stage = this;
    for (i = 0; i < stage.numEntities; i += 1) {
        var entity = stage.entities[i];
        if (entity.isPlayable === false) {
            window.setTimeout(function () { stage.play(context); }, 500);
            return false;
        }
    }
    for (i = 0; i < stage.numEntities; i += 1) {
        var entity = stage.entities[i];
        entity.play(context);
    }
    return true;
};
