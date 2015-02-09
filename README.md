novel-ties
==========

HTMLベースのノベルゲームフレームワーク

## 使い方

1. `novel-ties.js` をロードする。

```
<script src="novel-ties.js"> </script>
```

2. JS に描画したいエンティティ（__Background__, __Character__, __TextWindow__）のインスタンスを作成する。

```
// 引数 id, imageUri, canvasWidth, canvasHeight
var bg = new __Background__('bg', 'bg.jpg', 1600, 1200);
bg.loadImage(); // __Background__ はロードが必要

// 引数 id, 名前, imageUris, dx, dy, dw, dh
// imageUris は描画する順に並べておく
var char = new __Character__('hoge', 'ほげ',
        ['./images/hoge-body.png',
         './images/hoge-cloth.png',
         './images/hoge-face.png'],
        0, 0, 600, 800);
char.loadImages(); // __Character__ はロードが必要

// 引数 text, canvasWidth, canvasHeight, margin, padding, fontSize
var tw = new __TextWindow__('ふが');

```

3. JS にエンティティの配列を格納した舞台（__Stage__）のインスタンスを作成し、プレイする。

```
var canvasOne = document.getElementById("canvasOne"),
    context = canvasOne.getContext("2d");

// エンティティの順序は __Stage__ 側で並び替えられる
var stage = new __Stage__('stage1', [bg, tw, char]);
stage.play(context);
```
