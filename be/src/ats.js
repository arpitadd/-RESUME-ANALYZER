export function deterministicAtsChecks(text, roleKeywords = []) {
  let score = 40;
  const issues = [];

  if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text)) {
    score -= 10;
    issues.push("Missing email");
  }

  if (!/\+?\d{7,}/.test(text)) {
    score -= 10;
    issues.push("Missing phone number");
  }

  if (!/\b(education|experience|projects|skills)\b/i.test(text)) {
    score -= 10;
    issues.push("Missing key section headings");
  }

  const words = text.split(/\s+/).length;
  if (words < 150) issues.push("Resume too short");
  if (words > 2500) issues.push("Resume too long");

  const hits = roleKeywords.filter(k => new RegExp(`\\b${k}\\b`, "i").test(text));
  const coverage = roleKeywords.length ? hits.length / roleKeywords.length : 0;

  const keywordScore = Math.round(coverage * 20);

  return {
    ruleScore: Math.max(score, 0),
    keywordScore,
    issues
  };
}
