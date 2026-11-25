// ==UserScript==
// @name        SVG Path Width 🔵
// @namespace        http://tampermonkey.net/
// @version        0.5
// @description        編集画面のpathコードの幅を修正する ショートカット「F9」
// @author        Ameba Blog User
// @match        https://*/*
// @run-at        document-start
// @grant        none
// @updateURL        https://github.com/personwritep/SVG_Path_Width/raw/main/SVG_Path_Width.user.js
// @downloadURL        https://github.com/personwritep/SVG_Path_Width/raw/main/SVG_Path_Width.user.js
// ==/UserScript==



if(!location.hostname.includes('example.net')){
    window.addEventListener('keydown', check_key);
    function check_key(event){
        if(event.keyCode==120){ // ショートカット「F9」
            event.preventDefault();
            event.stopImmediatePropagation();
            let win_apper='left=100, top=100, width=1024, height=400';
            window.open('https://example.net/', null , win_apper); }}}
else{
    env();
    setTimeout(()=>{
        main();
    }, 300); }


function env(){
    let head=document.head;
    if(head){
        let lang='<meta http-equiv="Content-Language" content="ja">';
        head.insertAdjacentHTML('beforeend', lang);

        let pre_style=head.querySelector('style');
        if(pre_style){
            pre_style.remove(); }}

    setTimeout(()=>{
        let pre_div=document.querySelector('body > div');
        if(pre_div){
            pre_div.remove(); }
    }, 200);

} // env()



function main(){
    let row_count=80; // コード1行の文字数
    let pre_code; // 編集枠のコード
    let stack_g=[]; // コード文字の取得用の配列
    let stack_o=[]; // コード文字の出力用の配列


    let help_url='https://ameblo.jp/personwritep/entry-12872543694.html'

    let SVG_h=
        '<svg class="svg_help" height="22" width="22"  viewBox="0 0 200 200">'+
        '<path d="M89 22C71 25 54 33 41 46C7 81 11 142 50 171C58 177 68 182 78 18'+
        '5C90 188 103 189 115 187C126 185 137 181 146 175C155 169 163 162 169 153'+
        'C190 123 189 80 166 52C147 30 118 18 89 22z" style="fill:#888;"></path>'+
        '<path d="M67 77C73 75 78 72 84 70C94 66 114 67 109 83C106 91 98 95 93 10'+
        '1C86 109 83 116 83 126L111 126C112 114 122 108 129 100C137 90 141 76 135'+
        ' 64C127 45 101 45 84 48C80 49 71 50 68 54C67 56 67 59 67 61L67 77M85 143'+
        'L85 166L110 166L110 143L85 143z" style="fill:#fff;"></path>'+
        '</svg>';

    let base=
        '<div id="base_board">'+
        '<style>'+
        '#base_board { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; '+
        'z-index: 1; background: #9ab6c8; } '+
        '</style>'+
        '</div>'+
        '<div class="code_panel">'+
        '<div class="control">'+
        '<a href="'+ help_url +'" target="_blank" rel="noopener noreferrer">'+
        SVG_h +'</a>'+
        '<input class="single_quote" type="submit" value="Change ❛ ⇔ ❝">　'+
        '<input class="tab_clear" type="submit" value="Tab Clear">　'+
        '<span>Characters / line：'+
        '<input class="row" type="number" min="20" max="200"></span>　　'+
        '<input class="out_copy" type="submit" value="Copy Code">'+
        '</div>'+
        '<pre contenteditable="true"></pre>'+
        '<style>'+
        '.code_panel { position: relative; top: 20px; margin: 0 auto;'+
        'font: normal 16px/20px Meiryo; width: 98%; min-width: 680px; '+
        'background: #fff; border: 2px solid #2196f3; z-index: 4; } '+
        '.code_panel .control { display: flex; justify-content: flex-start; '+
        'padding: 6px 4px 5px; border-bottom: 1px solid #333; background: #c7e5fc; } '+
        '.code_panel .control .svg_help { vertical-align: -11px; } '+
        '.code_panel .control input { font: normal 16px/24px Meiryo; padding: 2px 8px 0; '+
        'margin: 0 4px; } '+
        '.code_panel .control .row { width: 50px; padding: 2px 4px 0 12px; vertical-align: 0; } '+
        '.code_panel pre { '+
        'font: normal 16px/20px Meiryo; margin: 0; padding: 20px 30px; '+
        'max-height: calc(100vh - 165px); overflow-y: scroll; } '+
        '.code_panel pre:focus { outline: none; } '+
        'body > P, body > svg { display: none; } '+
        'svg { display: revert; margin: 0; opacity: 1; } '+
        '</style></div>';

    if(!document.querySelector('.code_panel')){
        document.body.insertAdjacentHTML('beforeend', base); }



    to_single();


    function to_single(){
        let single_quote=document.querySelector('.single_quote');
        let pre=document.querySelector('.code_panel pre');
        if(single_quote && pre){
            single_quote.onclick=function(){
                pre_code=pre.textContent;
                if(pre_code){
                    pre.textContent=single_double(pre_code); }}}

    } // to_single()



    function single_double(pre_text){
        let pre_text_e=pre_text.replace(/"/g, '▮');
        pre_text_e=pre_text_e.replace(/'/g, '"');
        pre_text_e=pre_text_e.replace(/▮/g, "'");

        return pre_text_e; }



    pre_work();

    function pre_work(){
        let tab_clear=document.querySelector('.tab_clear');
        let pre=document.querySelector('.code_panel pre');
        if(tab_clear && pre){
            tab_clear.onclick=function(){
                pre_code=pre.textContent;
                if(pre_code){
                    get_text(pre_code);
                    let stack_str=stack_g.join('');
                    pre.textContent=output(stack_str);
                    outpanel_set(); }}}

    } // pre_work()



    function get_text(text){
        let text_0=''; // クォーテーションチェック済

        let count=text.match(/'/g).length
        let count_d=text.match(/"/g).length
        if(count%2==1){ //「'」に端数がある
            alert("⛔対象コードは「❛」「❛+」の数が一致しません");
            if(count_d%2==1){
                alert("⛔クォーテーションの開始・終結を調べてください"); }
            else if(count_d%2==0){
                let ok=confirm(
                    "行端処理が「❝」「❝＋」のコードとして処理しますか？");
                if(ok){
                    text_0=single_double(text); }}}
        else{
            text_0=text; }


        if(text_0!=''){
            let top_str=text_0.substring(0, text_0.indexOf("'"));
            if(top_str){ // 最初の「'」より手前に文字がある
                top_str=top_str.replace(/\s/g,'');
                if(top_str.length>0){ // 最初の「'」より手前に半角空白以外の文字がある
                    alert("⛔対象コードが「❛　❛+」の中から始まっています"); }
                else{ // 最初の「'」より手前に半角空白以外の文字がない
                    clean(text_0); }}
            else{ // 最初の「'」より手前に文字がない
                clean(text_0); }


            function clean(text){
                stack_g=[]; // コード文字の配列をリセット
                for(let index=0; true;){
                    let s=text.indexOf("'", index); // index位置から検索
                    if(s==-1){ break; } //「'」がなければ終了
                    let e=text.indexOf("'", s+1); // 発見した位置より後方の「'」を検索
                    if(e==-1){ break; } //「'」がなければ終了
                    stack_g.push(text.substring(s+1, e)); // s e の位置を切出す
                    index=e+1; }
                return stack_g; }

        } // if(text_0!='')

    } // get_text()



    function outpanel_set(){
        let row=document.querySelector('.row');
        if(row){
            row.value=row_count;
            row.onchange=function(){
                edit_row(row.value*1); }}

        function edit_row(row_set){
            if(19<row_set && row_set<201){ // 文字数は 20～ 200
                row_count=row_set;
                let pre=document.querySelector('.code_panel pre');
                if(pre){
                    pre.textContent=output(); }}}

        window.addEventListener('keydown', (event)=>{ // ⇧⇩キーで inputにフォーカス
            if(event.keyCode==40 || event.keyCode==38){
                let row=document.querySelector('.row');
                if(row){
                    row.focus(); }}});


        let out_copy=document.querySelector('.out_copy');
        if(out_copy){
            out_copy.onclick=function(){
                copyToClipboard(output()); }

            function copyToClipboard(value){
                if(navigator.clipboard){ // navigator.clipboardが使えるか判定する
                    return navigator.clipboard.writeText(value).then(function(){ // コピー
                        out_copy.style.boxShadow='inset 0 0 0 20px #2196f350';
                        out_copy.style.outline='2px solid #fff';
                        setTimeout(()=>{
                            out_copy.style.boxShadow='';
                            out_copy.style.outline='';
                        }, 1000);
                    }); }}}

    } // outpanel_set()



    function output(stack_str){
        stack_g=[]; // リセット
        stack_o=[]; // リセット

        let pre=document.querySelector('.code_panel pre');
        if(pre){
            pre_code=pre.textContent;
            if(pre_code){
                get_text(pre_code);
                let stack_str=stack_g.join('');

                findText(stack_str); // タグ記号で区切る

                for(let k=0; k<stack_o.length; k++){ // pathタグは入れ子にならないので纏める
                    if(stack_o[k].startsWith('<path') && stack_o[k+1]=='</path>'){
                        stack_o[k] +='</path>';
                        stack_o[k+1]=''; }}

                stack_o=stack_o.filter(item=>{
                    return item!=''; });

                for(let k=0; k<stack_o.length; k++){ // row_countの文字ずつの行に区切る
                    stack_o[k]=break_words(stack_o[k]); }

                return stack_o.join('\n').slice(0, -1) +';'; }} // 繋いで末尾の「+」を「;」に変更


        function findText(text){
            let dataimage='';
            if(text.startsWith('data:image/svg')){ //「data:image/svg」に対応
                dataimage=text.slice(0, text.indexOf('<')); }

            for(let index=0; true;){
                let s=text.indexOf('<', index); // index位置から検索
                if(s==-1){ break; } // '<' を見つけたら後方の処理へ
                let e=text.indexOf('>', s +1); // 発見した位置より後方の'>'を検索
                if(e==-1){ break; } // '>' を見つけたら後方の処理へ
                stack_o.push('<'+ text.substring(s +1, e) +'>'); // s e の位置を切出す
                index=e +1; }

            if(dataimage!=''){
                stack_o[0]=dataimage+stack_o[0]; } // 先頭に「data:image/svg+xml,」を追加

            return stack_o; }


        function break_words(source_code){
            let s_arr=[];
            for (let i=0; i<source_code.length; i+=row_count){ // コード1行の文字数の指定
                s_arr.push(source_code.slice(i, i+row_count)); }

            let new_s_arr=[];
            for (let i=0; i<s_arr.length; i++){
                let row="'"+ s_arr[i] +"'+";
                new_s_arr.push(row); }

            return new_s_arr.join('\n'); }

    } // output()

} // main()
