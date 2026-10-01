let commandSession = {owner:null,items:[],index:0,checked:false,correct:0};
function commandWordsForOwner() {
    const owner = quizOwnerKey();
    return owner ? appData.commandWordProgress?.[owner] || {} : {};
}
function renderCommandWords() {
    const owner=quizOwnerKey();
    if(commandSession.owner!==owner){commandSession={owner,items:[],index:0,checked:false,correct:0};document.getElementById('command-training').classList.add('hidden');}
    const search = (document.getElementById('command-search').value || '').trim().toLowerCase();
    const words = COMMAND_WORDS.filter(c => [c.word,c.zh,c.task,c.subject].join(' ').toLowerCase().includes(search));
    const progress = commandWordsForOwner();
    const pending = Object.values(progress).filter(p => p.needsReview).length;
    document.getElementById('command-progress').textContent = `${COMMAND_WORDS.length} 个指令词 · ${pending} 个待巩固 Command words / Needs review`;
    document.getElementById('command-review-start').disabled = !pending;
    const list = document.getElementById('command-list');
    list.replaceChildren();
    words.forEach(c => {
        const detail = document.createElement('details'); detail.className = 'command-card';
        const summary = document.createElement('summary'); summary.textContent = `${c.word} · ${c.zh}${progress[c.word]?.needsReview ? ' · 待巩固 Review' : ''}`; detail.appendChild(summary);
        for (const [label,text] of [['题目要求 / Answer task',c.task],['写法提示 / Writing approach',c.structure],['常见误区 / Common mistake',c.mistake],['原创例题 / Original example',`${c.subject}: ${c.prompt}`],['中文思路 / Reasoning',c.reasoning],['英文表达示例 / Model wording',c.model]]) {
            const h = document.createElement('h4');h.textContent=label;
            const p=document.createElement('p');p.textContent=text;detail.append(h,p);
        }
        const a=document.createElement('a');a.href=c.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='官方指令词说明 / Official command guidance ↗';detail.appendChild(a);
        list.appendChild(detail);
    });
    if (!words.length) list.textContent='没有匹配的指令词 No matching command words';
}
function startCommandPractice(reviewOnly = false) {
    const progress = commandWordsForOwner();
    const items = COMMAND_PRACTICE.filter(item=>!reviewOnly || progress[item.word]?.needsReview);
    if (!items.length) { showToast('暂无待巩固指令词');return; }
    commandSession = {owner:quizOwnerKey(),items:shuffleArray(items),index:0,checked:false,correct:0};
    document.getElementById('command-training').classList.remove('hidden');
    renderCommandPractice();
}
function renderCommandPractice() {
    const item=commandSession.items[commandSession.index];
    document.getElementById('command-training-title').textContent=`答法辨析 ${commandSession.index+1}/${commandSession.items.length} · ${item.word}`;
    document.getElementById('command-question').textContent=item.prompt;
    document.getElementById('command-feedback').textContent='';
    document.getElementById('command-next').disabled=true;
    const options=document.getElementById('command-options');options.replaceChildren();
    item.options.forEach((text,index)=>{const button=document.createElement('button');button.type='button';button.className='btn btn-outline command-option';button.textContent=text;button.addEventListener('click',()=>answerCommandPractice(index));options.appendChild(button)});
}
function recordCommandAttempt(word, correct) {
    const owner=quizOwnerKey();if(!owner)return;
    appData.commandWordProgress ||= {};
    const words=appData.commandWordProgress[owner] ||= {};
    const prior=words[word] || {attempts:0,correct:0,correctStreak:0,needsReview:false};
    const correctStreak=correct ? prior.correctStreak+1 : 0;
    words[word]={attempts:prior.attempts+1,correct:prior.correct+(correct?1:0),correctStreak,needsReview:correct ? prior.needsReview && correctStreak<2 : true,lastPractised:getTodayStr()};
    saveData(appData);
}
function answerCommandPractice(index) {
    if (commandSession.checked || commandSession.owner !== quizOwnerKey())return;
    const item=commandSession.items[commandSession.index];
    if(!Number.isInteger(index)||index<0||index>=item.options.length)return;
    commandSession.checked=true;
    const correct=index===item.answer;if(correct)commandSession.correct++;
    recordCommandAttempt(item.word,correct);
    document.querySelectorAll('#command-options button').forEach(button=>button.disabled=true);
    document.getElementById('command-feedback').textContent=`${correct?'答法正确 Correct':'再巩固 Review'} · ${item.why} 正确答法：${item.options[item.answer]}`;
    document.getElementById('command-next').disabled=false;
    renderCommandWords();
}
function nextCommandPractice() {
    if(!commandSession.checked)return;
    commandSession.index++;
    if(commandSession.index>=commandSession.items.length){
        document.getElementById('command-training-title').textContent=`本轮完成 ${commandSession.correct}/${commandSession.items.length} · Completed`;
        document.getElementById('command-question').textContent='错过的指令词已加入待巩固；连续两次答法辨析正确后移出待巩固，历史仍保留。两次辨析正确仅表示本站练习进步，不代表已掌握真实考试作答。';
        document.getElementById('command-options').replaceChildren();document.getElementById('command-next').disabled=true;
        return;
    }
    commandSession.checked=false;renderCommandPractice();
}
function examAnswerGuideHtml(question) {
    const guide=EXAM_ANSWER_GUIDES[question.id];if(!guide)return '';
    return `<div class="exam-answer-guide"><h4>答题指导 / Answer coaching</h4><p><b>中文思路：</b>${escapeHtml(guide.reasoning)}</p><p><b>英文关键词 / Keywords：</b>${guide.keywords.map(escapeHtml).join(' · ')}</p><p lang="en"><b>英文表达示例 / Model wording：</b>${escapeHtml(guide.model)}</p><p><b>失分提醒 / Avoid：</b>${escapeHtml(guide.pitfall)}</p><small>本站原创表达示例，不是官方评分标准；完整作答以题目、分值和考纲要求为准。Original teaching example, not an official mark scheme.</small></div>`;
}

document.addEventListener('keydown',event=>{if(event.target?.matches?.('[data-page="commands"]') && ['Enter',' '].includes(event.key)){event.preventDefault();navigateTo('commands')}});
