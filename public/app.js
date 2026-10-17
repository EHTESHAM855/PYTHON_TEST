(() => {
  const form = document.getElementById("assessmentForm");
  const fields = [...form.querySelectorAll("textarea, input:not([type=button])")];
  const questionEls = [...form.querySelectorAll(".question")];
  const timerEl = document.getElementById("timer");
  const timerToggle = document.getElementById("timerToggle");
  let elapsed = 0;
  let paused = false;
  let timerId = null;
  let started = Date.now();

  const skillGroups = [
    {name:"Python basics", ids:["q1","q2","q3","q4"]},
    {name:"Tracing the code", ids:["q5","q6","q7"]},
    {name:"Conditions & logic", ids:["q8","q9","q10"]},
    {name:"Loops & debugging", ids:["q11","q12","q13"]},
    {name:"Independent coding", ids:["q14","q15","q16"]},
    {name:"Explain your thinking", ids:["q17","q18"]}
  ];

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
  function updateTimer() {
    timerEl.textContent = formatTime(elapsed);
  }
  timerId = window.setInterval(() => {
    if (!paused) { elapsed += 1; updateTimer(); }
  }, 1000);
  timerToggle.addEventListener("click", () => {
    paused = !paused;
    timerToggle.textContent = paused ? "Resume" : "Pause";
    timerToggle.setAttribute("aria-pressed", String(paused));
  });

  function isQuestionAnswered(question) {
    const controls = [...question.querySelectorAll("textarea, input")];
    return controls.some(control => control.type === "radio" ? control.checked : control.value.trim().length > 0);
  }
  function updateProgress() {
    const answered = questionEls.filter(isQuestionAnswered).length;
    const total = questionEls.length;
    const pct = Math.round(answered / total * 100);
    document.getElementById("progressText").textContent = `${answered} of ${total} answered`;
    document.getElementById("progressBar").style.width = `${pct}%`;
    document.getElementById("progressPercent").textContent = `${pct}%`;
    document.getElementById("progressHint").textContent = answered === 0 ? "Start with any question." : answered === total ? "All questions have a response." : "Keep going. An honest attempt helps most.";
  }
  fields.forEach(el => {
    el.addEventListener("input", updateProgress);
    el.addEventListener("change", updateProgress);
  });
  updateProgress();

  document.getElementById("reviewBtn").addEventListener("click", () => {
    const missing = questionEls.filter(q => !isQuestionAnswered(q));
    questionEls.forEach(q => q.classList.remove("unanswered-highlight"));
    if (!missing.length) {
      alert("Every question has a response. You can review your answers or create the report.");
      return;
    }
    missing.forEach(q => q.classList.add("unanswered-highlight"));
    missing[0].scrollIntoView({behavior:"smooth", block:"center"});
  });

  function gatherAnswers() {
    const result = {};
    for (const q of questionEls) {
      const qid = q.dataset.q;
      result[qid] = {};
      q.querySelectorAll("textarea, input").forEach(el => {
        if (el.type === "radio") {
          if (el.checked) result[qid][el.name] = el.value;
        } else {
          result[qid][el.name] = el.value.trim();
        }
      });
    }
    return result;
  }
  function countAnsweredInGroup(group, answers) {
    return group.ids.filter(id => Object.values(answers[id] || {}).some(v => String(v).trim())).length;
  }

  document.getElementById("submitBtn").addEventListener("click", () => {
    const answers = gatherAnswers();
    const answered = questionEls.filter(isQuestionAnswered).length;
    document.getElementById("resultAnswered").textContent = `${answered}/18`;
    document.getElementById("resultCompletion").textContent = `${Math.round(answered / 18 * 100)}%`;
    document.getElementById("resultTime").textContent = formatTime(elapsed);
    const container = document.getElementById("skillResults");
    container.innerHTML = "";
    skillGroups.forEach(group => {
      const count = countAnsweredInGroup(group, answers);
      const percent = Math.round(count / group.ids.length * 100);
      const div = document.createElement("div");
      div.className = "skill-row";
      div.innerHTML = `<div class="skill-row-top"><span></span><span></span></div><div class="skill-track"><div class="skill-fill"></div></div>`;
      div.querySelector(".skill-row-top span:first-child").textContent = group.name;
      div.querySelector(".skill-row-top span:last-child").textContent = `${count}/${group.ids.length} attempted`;
      div.querySelector(".skill-fill").style.width = `${percent}%`;
      container.appendChild(div);
    });
    const results = document.getElementById("results");
    results.classList.remove("hidden");
    results.dataset.answers = JSON.stringify(answers);
    results.dataset.elapsed = String(elapsed);
    results.dataset.answered = String(answered);
    results.scrollIntoView({behavior:"smooth", block:"start"});
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    form.scrollIntoView({behavior:"smooth", block:"start"});
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    const results = document.getElementById("results");
    const answers = JSON.parse(results.dataset.answers || "{}");
    const lines = [
      "PYTHON DIAGNOSTIC ASSESSMENT — TEACHER REPORT",
      `Generated: ${new Date().toLocaleString()}`,
      `Questions attempted: ${results.dataset.answered || 0}/18`,
      `Time elapsed: ${formatTime(Number(results.dataset.elapsed || 0))}`,
      "",
      "NOTE: This report does not automatically grade open-ended answers.",
      "Review correctness, independence, and explanations with the student.",
      ""
    ];
    const labels = {
      q1:"Q1 Output prediction", q2:"Q2 Data types", q3:"Q3 Debugging", q4:"Q4 Input/output",
      q5:"Q5 Variable tracing", q6:"Q6 Conditions output", q7:"Q7 Loop count", q8:"Q8 Even/odd",
      q9:"Q9 Pass/fail", q10:"Q10 Boolean logic", q11:"Q11 For loop", q12:"Q12 While-loop debugging",
      q13:"Q13 Trace and explain", q14:"Q14 Bill calculator", q15:"Q15 Number sequence",
      q16:"Q16 Mini quiz", q17:"Q17 Input vs int(input)", q18:"Q18 Debugging strategy"
    };
    Object.keys(labels).forEach(id => {
      lines.push(`${labels[id]}:`);
      const entries = Object.entries(answers[id] || {}).filter(([,v]) => String(v).trim());
      if (!entries.length) lines.push("  [No response]");
      else entries.forEach(([key, value]) => lines.push(`  ${key}: ${value.replace(/\r/g,"")}`));
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "python-diagnostic-teacher-report.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
})();
