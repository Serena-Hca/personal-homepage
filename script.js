const messages = document.querySelector("#messages");
const form = document.querySelector("#chatForm");
const input = document.querySelector("#questionInput");
const quickButtons = document.querySelectorAll("[data-question]");
const wechatCard = document.querySelector("[data-wechat]");

const knowledge = [
  {
    keywords: ["摄影", "拍照", "相机", "照片"],
    answer: "我喜欢摄影，因为它让我更认真地观察光线、情绪和生活中容易被忽略的细节。对我来说，摄影不只是按下快门，也是一种理解世界的方式。"
  },
  {
    keywords: ["最近", "现在", "做什么", "学习", "大学"],
    answer: "我现在是天津大学的大一学生，最近主要在适应大学生活、学习课程，也在探索自己未来真正想投入的方向。"
  },
  {
    keywords: ["脑机", "就业", "专业", "未来", "方向"],
    answer: "我正在关注脑机接口相关专业未来的就业方向。它连接脑科学、计算机、电子工程与医疗应用，我希望逐步了解行业需求，并思考大学阶段应该积累哪些能力。"
  },
  {
    keywords: ["性格", "特点", "怎么样的人", "爱笑"],
    answer: "我觉得自己是一个开放包容、愿意尝试新鲜事物的人。一个比较有记忆点的特点是爱笑，我也希望这种轻松和善意能感染身边的人。"
  },
  {
    keywords: ["名字", "是谁", "介绍", "身份"],
    answer: "我是何储安，一名天津大学大一学生。我热爱摄影，喜欢观察世界，也正在认真探索未来的发展方向。"
  },
  {
    keywords: ["学校", "天津大学", "天大"],
    answer: "我目前就读于天津大学，是一名大一学生。对我来说，大学是学习新知识、认识新朋友和不断探索自我的新起点。"
  },
  {
    keywords: ["微信", "联系", "电话", "邮箱", "手机", "怎么找"],
    answer: "我的微信号是 13953830088（与手机同号），也可以拨打 139 5383 0088，或发邮件到 heyuyao2018@126.com。欢迎来找我交流学习、摄影或脑机接口相关话题。"
  }
];

function getTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

function addMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const time = document.createElement("time");
  time.textContent = getTime();

  row.append(bubble, time);
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function findAnswer(question) {
  const normalized = question.trim().toLowerCase();
  const match = knowledge.find(item =>
    item.keywords.some(keyword => normalized.includes(keyword))
  );

  if (match) return match.answer;

  return "这个问题暂时超出了我的 V1 知识范围。你可以问我关于大学生活、摄影、个人性格、联系方式，或者脑机接口就业方向的问题。后续版本会继续丰富我的回答能力。";
}

function ask(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  addMessage(cleanQuestion, "user");
  input.value = "";
  input.focus();

  window.setTimeout(() => {
    addMessage(findAnswer(cleanQuestion), "bot");
  }, 450);
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);
  temp.select();
  try { document.execCommand("copy"); } catch (error) { /* 忽略不支持的环境 */ }
  temp.remove();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  ask(input.value);
});

quickButtons.forEach(button => {
  button.addEventListener("click", () => ask(button.dataset.question));
});

if (wechatCard) {
  const hint = wechatCard.querySelector("small");
  const originalHint = hint.textContent;

  wechatCard.addEventListener("click", () => {
    const id = wechatCard.dataset.wechat;
    const showCopied = () => {
      hint.textContent = "微信号已复制 ✓";
      window.setTimeout(() => { hint.textContent = originalHint; }, 2200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(id).then(showCopied).catch(() => {
        fallbackCopy(id);
        showCopied();
      });
    } else {
      fallbackCopy(id);
      showCopied();
    }
  });
}
