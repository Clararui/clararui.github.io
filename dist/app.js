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
    knowledge: {
      title: '知序 · 让知识不止于收藏',
      description: '一个围绕个人资料库的 AI 知识助手概念：让信息可以找回、理解，并与已有知识建立连接。',
      sections: [
        ['需要验证的问题', '当资料不断累积，用户能否在真正需要时找到它？比起一次性生成答案，用户是否更需要可追溯、可整理的知识关系？这些是概念阶段的假设。'],
        ['核心体验', '从一个明确的问题开始，检索用户提供的资料，呈现简洁回答与对应出处。允许跳转原文、修正理解，并把有用的结论整理成可再次使用的笔记。'],
        ['人机分工', 'AI 协助检索、归纳和发现关联；用户决定哪些资料可信、哪些结论值得保留。资料不足时，展示缺口，邀请用户补充。'],
        ['如何验证', '围绕真实资料设计查找与归纳任务，观察找到可靠答案所需的时间、引用是否准确，以及用户能否顺利回到原文。评估标准应在测试前确定。']
      ]
    },
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
