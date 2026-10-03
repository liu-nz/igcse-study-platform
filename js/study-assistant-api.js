// Optional OpenAI-compatible Chat Completions endpoint. Credentials live only in memory.
let studyAssistantApiConfig = null;
function toggleStudyAssistantApiPanel() {
    const panel=document.getElementById('study-api-panel');
    if(panel)panel.classList.toggle('hidden');
}
function isStudyAssistantApiConnected() { return Boolean(studyAssistantApiConfig?.key); }
function setStudyAssistantApiStatus(message) {
    const status=document.getElementById('study-api-status');
    if(status)status.textContent=message;
}
function connectStudyAssistantApi() {
    const endpoint=document.getElementById('study-api-endpoint').value.trim();
    const model=document.getElementById('study-api-model').value.trim();
    const key=document.getElementById('study-api-key').value.trim();
    let url;
    try { url=new URL(endpoint); } catch (_) { setStudyAssistantApiStatus('请输入有效的完整 API endpoint URL。');return; }
    const localHttp=url.protocol==='http:'&&(url.hostname==='localhost'||url.hostname==='127.0.0.1'||url.hostname==='[::1]');
    if((url.protocol!=='https:'&&!localHttp)||url.username||url.password||url.search||url.hash){setStudyAssistantApiStatus('仅允许 HTTPS endpoint（本机 localhost 可用 HTTP），且不能包含账号、密码或查询参数。');return;}
    if(!/\/chat\/completions\/?$/.test(url.pathname)){setStudyAssistantApiStatus('请输入 OpenAI-compatible Chat Completions 完整 endpoint（通常以 /v1/chat/completions 结尾）。');return;}
    if(!model||model.length>200||!key||key.length>500){setStudyAssistantApiStatus('请填写 model 和 API key；key 仅保存在当前页面内存中。');return;}
    studyAssistantApiConfig={endpoint:url.toString(),model,key};
    document.getElementById('study-api-key').value='';
    setStudyAssistantApiStatus(`本次页面会话已启用 ${model}。每次提问会直接发送到该 endpoint，可能产生 API 费用。`);
}
function clearStudyAssistantApi() {
    studyAssistantApiConfig=null;
    const key=document.getElementById('study-api-key');if(key)key.value='';
    setStudyAssistantApiStatus('已断开。学习助手使用内置本地知识库，不需要 API。');
}
async function getStudyAssistantApiResponse(question) {
    const config=studyAssistantApiConfig;
    if(!config?.key)return generateAIResponse(question);
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),30000);
    try {
        const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${config.key}`},signal:controller.signal,body:JSON.stringify({model:config.model,temperature:0.3,messages:[{role:'system',content:'You are an optional IGCSE study assistant for Chinese-speaking learners. Explain in clear Chinese, highlight the English exam keywords, and give concise IGCSE-style answer guidance. Do not claim official mark-scheme authority. If uncertain, say so.'},{role:'user',content:question}]})});
        let data;
        try { data=await response.json(); } catch (_) { throw new Error(`服务返回了无法读取的响应（HTTP ${response.status}）。`); }
        if(!response.ok)throw new Error(data?.error?.message||`服务请求失败（HTTP ${response.status}）。`);
        const content=data?.choices?.[0]?.message?.content;
        if(typeof content!=='string'||!content.trim())throw new Error('服务没有返回文字内容。');
        return {answer:content.slice(0,12000),source:`用户自带 API · ${config.model}`};
    } catch(error) {
        if(error.name==='AbortError')throw new Error('请求超时，请检查 endpoint 或网络。');
        if(error instanceof TypeError)throw new Error('浏览器无法连接此 endpoint；请检查网络及服务的 CORS 设置。');
        throw error;
    } finally { clearTimeout(timeout); }
}
window.addEventListener('pagehide',clearStudyAssistantApi);
