(() => {
  'use strict';
  const profile = window.PROFILE;
  document.querySelectorAll('[data-name]').forEach(el => { el.textContent = profile.name; });
  document.querySelectorAll('[data-role]').forEach(el => { el.textContent = profile.role; });
  document.querySelector('[data-intro]').textContent = profile.intro;
  document.title = `${profile.name} · ${profile.role}`;
  document.querySelector('meta[name="description"]').content = `${profile.name}的个人网站。${profile.role}。${profile.intro}`;
  document.querySelector('.header .brand').setAttribute('aria-label', `${profile.name}，返回首页`);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    const link = document.querySelector('#email-link');
    link.href = `mailto:${encodeURIComponent(profile.email)}`;
    link.hidden = false;
    document.querySelector('#save-card').className = 'text-link';
    document.querySelector('#contact-note').textContent = profile.email;
  }

  const projects = {
    workflow: {
      title: '轻流 · 把时间留给创造',
      description: '一个以可见、可控为核心的 Agent 工作流概念：让重复工作自动流转，让人掌握关键决定。',
      sections: [
        ['需要验证的问题', '一项重复工作中，哪些步骤规则明确，哪些需要判断？如果自动化过程不透明，节省的操作是否又变成了检查成本？'],
        ['核心体验', '把需求拆解为可检查的任务步骤，展示每一步的输入、状态与产出。在执行重要外部动作之前，呈现待确认结果，并允许用户修改、暂停或接手。'],
        ['人机分工', 'Agent 处理资料归纳、草稿生成和规则明确的步骤；用户设定目标与边界，对关键结果做最终判断。失败时保留上下文，支持从中断处恢复。'],
        ['如何验证', '选择一个边界清晰的流程，对比手动与辅助完成的耗时、返工次数、错误恢复情况。通过观察与访谈了解用户是否真正理解系统的行为。']
      ]
    }
  };
  const dialog = document.querySelector('#project-dialog');
  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const project = projects[button.dataset.project];
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-description').textContent = project.description;
      const content = document.querySelector('#dialog-content');
      content.replaceChildren();
      project.sections.forEach(([title, text]) => {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        const paragraph = document.createElement('p');
        heading.textContent = title;
        paragraph.textContent = text;
        section.append(heading, paragraph);
        content.append(section);
      });
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

  let toastTimer;
  function notify(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }
  const escapeVcard = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  document.querySelector('#save-card').addEventListener('click', () => {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVcard(profile.name)}`, `N:${escapeVcard(profile.name)};;;;`, `TITLE:${escapeVcard(profile.role)}`];
    if (profile.email) lines.push(`EMAIL:${escapeVcard(profile.email)}`);
    if (location.protocol.startsWith('http') && !['localhost', '127.0.0.1'].includes(location.hostname)) lines.push(`URL:${location.origin}${location.pathname}`);
    lines.push('END:VCARD');
    const url = URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], {type: 'text/vcard;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = `${profile.name}.vcf`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('名片已生成，请查看下载文件');
  });
  document.querySelector('#share-site').addEventListener('click', async () => {
    const url = location.href.split('#')[0];
    if (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)) {
      notify('当前是本地预览，网站上线后即可分享链接');
      return;
    }
    try {
      if (navigator.share) await navigator.share({title: document.title, url});
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); notify('网站链接已复制'); }
      else window.prompt('复制网站链接', url);
    } catch (error) {
      if (error.name !== 'AbortError') window.prompt('复制网站链接', url);
    }
  });
})();
