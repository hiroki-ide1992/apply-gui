// SCSS import
import '../scss/main.scss';
// Module import
import { modalInit } from './module/_modal';

/* 宣言
-------------------------*/
// COMMON
// 各ステップの親要素
const stepLayouts = document.querySelectorAll('.js-stepLayout');

// 調査結果が格納される配列
let resultData = [];

// アプライリストの画像名
let applyImageNames = [];
let applyImageDirectorys = [];

// 調査画像のデータ
let folders = [];

// STEP 0
// 基準となるURLが入力されたinput要素
const selectButton = document.getElementById('selectButton');
// URLを判定するために正規表現
const urlRegex = /^(https?)(:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)/;
let url;

// STEP 1
// アプライリストがドラッグされるinput要素
const inputFile = document.getElementById('applyList');
// 画像の拡張子を判定する正規表現
const imageRegex = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.svg|\.webp)/i;
// アプライリストの拡張子を判定する正規表現
const listRegex = /.(list)$/;
// STEP2にアペンドするテンプレート
const append2Template = document.getElementById('append2Template');
const appendStep2 = document.getElementById('appendStep2');


// STEP 2
const inputAll = document.querySelector('.js-card__inputCheckAll');
const nextButton = document.querySelector('#nextButton');
const appendStep3 = document.querySelector('#appendStep3');
const append3Template = document.querySelector('#append3Template');

// STEP 3
const searchButton = document.querySelector('#searchButton');

// Result
const appendResult = document.querySelector('#appendResult');
const resultTemplate = document.querySelector('#resultTemplate');

/* 関数
-------------------------*/
/**
 * [completeOn]
 * 各ステップが完了した際に、そのカードをカバーし、次のステップを表示させる
 * @param { HTMLAnchorElement } _this - イベントが発生したHTML。親要素のjs-card__completeを取得するのに使用
 * @param { number } index - 次のSTEPインデックス
 * @returns { void }
 */
function completeOn(_this, index) {
  const completeCover = _this.closest('.js-card').querySelector('.js-card__complete');
  completeCover.classList.remove('card__complete--hide');

  setTimeout(function(){
    stepLayouts[index].classList.remove('stepLayout--hide');
  }, 500);
}

/**
 * [somFolderData]
 * foldersの中に既にオブジェクトが設定済みかどうかをidで判定
 * @param { Array } folders - 調査情報のオブジェクトが格納された配列
 * @param { number } index - アップされたURLのインデックス
 * @returns { boolean }
*/
function somFolderData(folders, index) {
  for(let object of folders){
    if(object.id == index) return true;
  }
  return false;
}

/**
 * [compareArrayBuffers]
 * foldersの中に既にオブジェクトが設定済みかどうかをidで判定
 * @param { Array } buffer1 - 調査情報のオブジェクトが格納された配列
 * @param { number } buffer2 - アップされたURLのインデックス
 * @returns { boolean }
*/
function compareArrayBuffers(buffer1, buffer2) {
  if (buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);

  for (let i = 0; i < view1.byteLength; i++) {
    if (view1[i] !== view2[i]) {
      return false;
    }
  }

  return true;
}

/**
 * [setImageData]
 * foldersの中に既にオブジェクトが設定済みかどうかをidで判定
 * @param { Array } folders - 調査情報のオブジェクトが格納された配列
 * @param { number } index - アップされたURLのインデックス
*/
function setImageData(type, imageData, files, directory) {
  let imageBuffers = [];
  let imageNames = [];
  let directoryArray = [];

  if(type === 'honban') {
    for(let file of files) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageBuffers.push(e.target.result);
        imageNames.push(file.name);
        directoryArray.push(directory + '/' + file.name);
      }
      reader.readAsArrayBuffer(file);
    }
    imageData.honban = imageBuffers;
    imageData.honbanNames = imageNames;
    imageData.honbanDirectorys = directoryArray;
  } else if(type = 'setuzoku'){
    for(let file of files) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageBuffers.push(e.target.result);
        imageNames.push(file.name);
        directoryArray.push(directory + '/' + file.name)
      }
      reader.readAsArrayBuffer(file);
    }
    imageData.setuzoku = imageBuffers;
    imageData.seteuzokuNames = imageNames;
    imageData.setuzokuDirectorys = directoryArray;
  }

  return imageData;
}

/* 処理
-------------------------*/
modalInit();

// STEP 0
// 基準となるURLを設定
// デフォルト値が設定されているので、基本はそのまま
// 変数 url をその後の処理でも使いまわす
selectButton.addEventListener('click', function(){
  const settingUrl = document.getElementById('settingUrl').value;

  if(!urlRegex.test(settingUrl)) { alert('URLを設定してください'); return }

  url = settingUrl;
  completeOn(this, 1);
});


// STEP 1
// アプライリストを読み込み、画像ディレクトリのみを抽出して STEP2 へ渡す
inputFile.addEventListener("change", function() {
  const file = this.files[0];
  const fileName = file.name;
  // 拡張子が .list 以外の場合処理終了
  if(!listRegex.test(fileName)) { alert('.list のファイルをアップロードしてください'); return }

  const reader = new FileReader();
  const _this = this;

  // アプライリストをテキストとして読み込む
  reader.readAsText(file);

  // ファイルの読み込みが終了したときのイベントリスナーを設定
  reader.onload = function(e) {
    // ファイルの内容をテキストとして取得、中身を改行毎に配列化
    const applyContent = e.target.result.split(/\n/);
    const applyContentList = applyContent.map(content => content.replace(/\r?\n|\r/g, ''));

    // アプライリストの中から画像リストだけをフィルタリング
    const imageApplyAll = applyContentList.map((applyListItem, index) => {
      if(imageRegex.test(applyListItem)){
        applyImageDirectorys[index] = applyListItem;
        let directory = applyListItem.split('/');
        applyImageNames[index] = directory.pop();
        directory = directory.join('/');
        return directory;
      }
    }).filter(Boolean);

    // アプライリストに画像が無い場合処理終了
    if(!imageApplyAll.length) { alert('画像のアプライリストがありません'); return }

    // 被っている画像名を削除
    applyImageNames = applyImageNames.filter((applyImageName, index) => applyImageNames.indexOf(applyImageName) == index);

    // 被っているディレクトリを削除
    const imageApply = imageApplyAll.filter((directory, index) => imageApplyAll.indexOf(directory) == index );

    imageApply.forEach((directory, index)=>{
      const append2TemplateClone = append2Template.content.cloneNode(true);
      append2TemplateClone.querySelector('#checkText').textContent = directory;
      append2TemplateClone.querySelector('#checkLabel').setAttribute('for', `check${index}`);
      append2TemplateClone.querySelector('.js-card__inputCheckId').setAttribute('id', `check${index}`);
      append2TemplateClone.querySelector('.js-card__inputCheckId').setAttribute('value', directory);
      appendStep2.appendChild(append2TemplateClone);
      completeOn(_this, 2);
    });
  };

}, false);


// STEP 2
// 「すべて」を押下時の処理
inputAll.addEventListener('change', function(){
  const isChecked = this.checked;
  const inputCheckAll = document.querySelectorAll('.js-card__inputCheckId');
  if(isChecked) {
    for(let inputCheck of inputCheckAll){
      inputCheck.checked = true;
    }
  } else {
    for(let inputCheck of inputCheckAll){
      inputCheck.checked = false;
    }
  }
});

// 各チェックボックスを押下時の処理
appendStep2.addEventListener('change', function(e) {
  const target = e.target;

  if (!target.classList.contains('js-card__inputCheckId')) return;

  const inputCheckId = document.querySelectorAll('.js-card__inputCheckId').length;
  const inputCheckIdChecked = document.querySelectorAll('.js-card__inputCheckId:checked').length;
  const inputCheckAll = document.querySelector('.js-card__inputCheckAll');

  if(inputCheckIdChecked === inputCheckId){
    inputCheckAll.checked = true;
  } else {
    inputCheckAll.checked = false;
  }
});

// チェックされたディレクトリを STEP3 へ渡す
nextButton.addEventListener('click', function(){
  const inputChecked = document.querySelectorAll('.js-card__inputCheckId:checked');
  const isChecked = inputChecked.length;
  const _this = this;

  if(!isChecked){ alert('調査するディレクトリを選択してください'); return }

  inputChecked.forEach((directory, index)=>{
    const append3TemplateClone = append3Template.content.cloneNode(true);
      append3TemplateClone.querySelector('.js-setUrlText').textContent = directory.value;
      append3TemplateClone.querySelector('.js-card__seletCancel').dataset.index = index;
      append3TemplateClone.querySelectorAll('.js-inputSearch').forEach( input =>{
      input.dataset.index = index;
    });

    appendStep3.appendChild(append3TemplateClone);
    completeOn(_this, 3);
  });
});


// STEP 3
// 各ドロップ領域が変更された時の処理
appendStep3.addEventListener('change', function(e) {
  const target = e.target;

  if (!target.classList.contains('js-inputSearch')) return;

  // ドロップされた input の index
  const index = Number(target.dataset.index);
  // ドロップされた画像のタイプ（honban or setuzoku）
  const type = target.name;
  // ドロップされたファイル群
  const files = target.files;
  // テキストになっているディレクトリを全て取得
  const directorys = target.closest('.js-card').querySelectorAll('.js-setUrlText');
  const directory = directorys[index].textContent;

  if(somFolderData(folders, index)){
    setImageData(type, folders[index], files, directory);
  } else if (folders.length === 0 || !somFolderData(folders,index)) {

    // 初回登録、または未登録のURLの時の処理
    let imageData = {
      id: index,
      directory: directory
    };

    setImageData(type, imageData, files, directory);
    folders.push(imageData);
  }

  // ドロップ領域を非表示に変更
  const inpuFileBox = target.closest('.js-card__inputFileBox');
  const selectCansel = target.closest('.js-card__upload').querySelector('.js-card__seletCancel');
  inpuFileBox.classList.add('animate__flipOutX');
  setTimeout(function(){
    inpuFileBox.style.paddingTop = '0%';
    selectCansel.classList.remove('card__seletCancel--hide');
  }, 600);

  // 「取り消し」ボタン押下後、再度同じファイルをアップできるようにするため file input の値をリセット
  target.value = '';
});

// 「取り消し」ボタンが押下された時の処理
appendStep3.addEventListener('click', function(e){
  const target = e.target;
  if (!target.classList.contains('js-card__seletCancel')) return;

  // すべてのドロップ領域を取得
  const inpuFileBox = target.closest('.js-card__upload').querySelector('.js-card__inputFileBox');

  target.classList.add('card__seletCancel--hide');
  inpuFileBox.removeAttribute('style');
  inpuFileBox.classList.remove('animate__flipOutX');
});

// 「調査」ボタンが押下された時の処理
searchButton.addEventListener('click', function(){

  if(!folders.length) { alert('ファイルがありません'); return }

  if(document.querySelectorAll('.card__seletCancel--hide').length !== 0) { alert('セットされていないフォルダがあります'); return }

  const _this = this;

  folders.map((folder) => {
    // directory の値を格納
    let { id, directory, honban, honbanNames, honbanDirectorys, setuzoku, seteuzokuNames, setuzokuDirectorys } = folder;

    setuzokuDirectorys.forEach((setuzokuDirectory, index) => {
      // 調査結果を格納する用の初期 Object
      const resultDataItem = { apply: '', url: '', image:'', real: '', diff: '', status: '', sort:'' };

      // アプライリストに記載があるかどうか
      applyImageDirectorys.includes(setuzokuDirectory) ? resultDataItem.apply = 'あり' : resultDataItem.apply = 'なし';

      // 調査したURL
      resultDataItem.url = url + setuzokuDirectory;
      resultDataItem.image = seteuzokuNames[index];

      // 本番にあるかどうか
      if(honbanDirectorys.includes(setuzokuDirectory)) {
        resultDataItem.real = 'あり'
      } else {
        resultDataItem.real = 'なし';
      }

      // 本番と差分があるかどうか
      if(resultDataItem.real == 'あり') {
        for(let honbanBuffer of honban) {
          if(compareArrayBuffers(honbanBuffer, setuzoku[index])) {
            resultDataItem.diff = 'なし';
            break
          } else {
            resultDataItem.diff = 'あり';
          }
        }
      } else {
        resultDataItem.diff = '本番に画像なし';
      }

      if(resultDataItem.diff == 'あり' && resultDataItem.apply == 'なし'){
        // 本番画像とローカル画像で差分があり、かつアプライリストに記載が無し(=アプライリストに記載漏れ)
        resultDataItem.status = '要確認：アプライリストに記載漏れの恐れあり';
        resultDataItem.sort = 1;
      }

      if (resultDataItem.diff == 'なし' && resultDataItem.apply== 'あり') {
        // 本番画像とローカル画像で差分がなし、かつアプライリストに記載があり(=不要なアプライリストがある可能性あり)
        resultDataItem.status = '要確認：不要なアプライリストである恐れあり';
        resultDataItem.sort = 1;
      }

      if (resultDataItem.real == 'なし' && resultDataItem.apply == 'なし') {
        // 本番に存在しないが、アプライリストに記載無し(=アプライリストに記載漏れ)
        resultDataItem.status = '要確認：アプライリストに記載漏れの恐れあり';
        resultDataItem.sort = 1;
      }

      resultData.push(resultDataItem);
    });
  });

  resultData = resultData.sort((e, i) => { return e.sort === 1 ? -1 : 1});

  resultData.forEach((resultDataItem)=>{
    const resultTemplateClone = resultTemplate.content.cloneNode(true);
    resultTemplateClone.querySelector('#tabelUrl').textContent = resultDataItem.url;
    resultTemplateClone.querySelector('#tabelUrl').setAttribute('href', resultDataItem.url);
    resultTemplateClone.querySelector('#tableImage').textContent = resultDataItem.image;
    resultTemplateClone.querySelector('#tableApply').textContent = resultDataItem.apply;
    resultTemplateClone.querySelector('#tableDiff').textContent = resultDataItem.diff;
    resultTemplateClone.querySelector('#tableStatus').textContent = resultDataItem.status;

    if(resultDataItem.status != '' ) {
      resultTemplateClone.querySelector('#tabelTr').classList.add('resultTable__check');
    }

    appendResult.appendChild(resultTemplateClone);
  });

  document.querySelector('#searchCount').textContent = resultData.length;

  completeOn(_this, 4);

});